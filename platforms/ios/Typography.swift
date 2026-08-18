//
//  Typography.swift
//  Marginalia
//
//  Runtime for the typography tokens. The token values themselves live in
//  TypographyTokens.generated.swift, generated from tokens/typography.json.
//

import Foundation
import SwiftUI

#if canImport(UIKit)
import UIKit
#endif

// MARK: - Token

/// A single semantic type style: family, weight, size, line height and tracking,
/// anchored to a Dynamic Type text style so it scales with the reader's setting.
public struct TypographyToken: Sendable, Hashable {

    public enum Family: String, Sendable, Hashable, CaseIterable {
        case sans
        case serif
    }

    public enum Weight: String, Sendable, Hashable, CaseIterable {
        case regular
        case medium
        case semibold
        case bold
    }

    /// Dotted token name, e.g. `"editorial.body"`. Useful in snapshots and logs.
    public let name: String
    public let family: Family
    public let weight: Weight
    /// Size in points at the default Dynamic Type size (Large).
    public let size: CGFloat
    /// Total line height in points at the default Dynamic Type size.
    public let lineHeight: CGFloat
    /// Letter spacing in points at `size`; scaled proportionally when the font scales.
    public let tracking: CGFloat
    /// Dynamic Type anchor — the style this token scales alongside.
    public let textStyle: Font.TextStyle
    /// Optical size axis value for variable fonts that expose `opsz` (Newsreader does).
    public let opticalSize: CGFloat?
    public let isItalic: Bool
    public let isUppercased: Bool

    public init(
        name: String,
        family: Family,
        weight: Weight,
        size: CGFloat,
        lineHeight: CGFloat,
        tracking: CGFloat,
        textStyle: Font.TextStyle,
        opticalSize: CGFloat? = nil,
        isItalic: Bool = false,
        isUppercased: Bool = false
    ) {
        self.name = name
        self.family = family
        self.weight = weight
        self.size = size
        self.lineHeight = lineHeight
        self.tracking = tracking
        self.textStyle = textStyle
        self.opticalSize = opticalSize
        self.isItalic = isItalic
        self.isUppercased = isUppercased
    }

    /// Line height expressed as a multiple of the font size — handy for layout maths.
    public var lineHeightMultiple: CGFloat { lineHeight / size }
}

#if canImport(UIKit)

// MARK: - Resolution

public extension TypographyToken {

    /// The UIKit text style this token scales with.
    var uiTextStyle: UIFont.TextStyle {
        switch textStyle {
        case .largeTitle: return .largeTitle
        case .title: return .title1
        case .title2: return .title2
        case .title3: return .title3
        case .headline: return .headline
        case .subheadline: return .subheadline
        case .callout: return .callout
        case .footnote: return .footnote
        case .caption: return .caption1
        case .caption2: return .caption2
        case .body: return .body
        @unknown default: return .body
        }
    }

    /// Point size after Dynamic Type scaling for the given trait collection.
    func scaledSize(compatibleWith traits: UITraitCollection? = nil) -> CGFloat {
        UIFontMetrics(forTextStyle: uiTextStyle)
            .scaledValue(for: size, compatibleWith: traits)
    }

    /// Line height after Dynamic Type scaling.
    func scaledLineHeight(compatibleWith traits: UITraitCollection? = nil) -> CGFloat {
        UIFontMetrics(forTextStyle: uiTextStyle)
            .scaledValue(for: lineHeight, compatibleWith: traits)
    }

    /// Tracking after Dynamic Type scaling — kept proportional to the size.
    func scaledTracking(compatibleWith traits: UITraitCollection? = nil) -> CGFloat {
        guard tracking != 0, size > 0 else { return 0 }
        return tracking * (scaledSize(compatibleWith: traits) / size)
    }

    /// A `UIFont` for this token, scaled for Dynamic Type.
    ///
    /// Falls back to the system font at the same size and weight if the custom
    /// face is missing, so a font that failed to register degrades rather than crashes.
    func uiFont(compatibleWith traits: UITraitCollection? = nil) -> UIFont {
        let pointSize = scaledSize(compatibleWith: traits)
        let postScriptName = family.postScriptName(weight: weight, italic: isItalic)

        guard var font = UIFont(name: postScriptName, size: pointSize) else {
            TypographyDiagnostics.reportMissingFont(named: postScriptName, token: self)
            var systemFont = UIFont.systemFont(ofSize: pointSize, weight: weight.uiFontWeight)
            if isItalic, let italic = systemFont.fontDescriptor.withSymbolicTraits(.traitItalic) {
                systemFont = UIFont(descriptor: italic, size: pointSize)
            }
            return systemFont
        }

        if let opticalSize, let varied = font.applyingVariation(axis: .opticalSize, value: opticalSize) {
            font = varied
        }
        return font
    }

    /// A SwiftUI `Font` for this token, scaled for Dynamic Type.
    var font: Font {
        Font(uiFont() as CTFont)
    }

    /// Attributed-string attributes for UIKit text views — the reading surface
    /// uses these so highlights and notes keep the same metrics as SwiftUI text.
    func attributes(
        alignment: NSTextAlignment = .natural,
        lineBreakMode: NSLineBreakMode = .byWordWrapping,
        compatibleWith traits: UITraitCollection? = nil
    ) -> [NSAttributedString.Key: Any] {
        let font = uiFont(compatibleWith: traits)
        let targetLineHeight = scaledLineHeight(compatibleWith: traits)

        let paragraph = NSMutableParagraphStyle()
        paragraph.alignment = alignment
        paragraph.lineBreakMode = lineBreakMode
        paragraph.minimumLineHeight = targetLineHeight
        paragraph.maximumLineHeight = targetLineHeight

        var attributes: [NSAttributedString.Key: Any] = [
            .font: font,
            .paragraphStyle: paragraph,
            // Nudge the glyphs so the extra leading sits above and below evenly
            // instead of all of it landing under the baseline.
            .baselineOffset: (targetLineHeight - font.lineHeight) / 4,
        ]

        let tracking = scaledTracking(compatibleWith: traits)
        if tracking != 0 {
            attributes[.kern] = tracking
        }
        return attributes
    }
}

private extension TypographyToken.Weight {
    var uiFontWeight: UIFont.Weight {
        switch self {
        case .regular: return .regular
        case .medium: return .medium
        case .semibold: return .semibold
        case .bold: return .bold
        }
    }
}

// MARK: - Variable font axes

private extension UIFont {
    enum VariationAxis: Int {
        /// Four-character tag `opsz` as a 32-bit identifier.
        case opticalSize = 0x6F70_737A
    }

    /// Applies a variable-font axis value, returning nil if the face has no such axis.
    func applyingVariation(axis: VariationAxis, value: CGFloat) -> UIFont? {
        let ctFont = self as CTFont
        guard let axes = CTFontCopyVariationAxes(ctFont) as? [[CFString: Any]],
              axes.contains(where: { ($0[kCTFontVariationAxisIdentifierKey] as? Int) == axis.rawValue })
        else { return nil }

        let descriptor = fontDescriptor.addingAttributes([
            UIFontDescriptor.AttributeName(kCTFontVariationAttribute as String): [axis.rawValue: value],
        ])
        return UIFont(descriptor: descriptor, size: pointSize)
    }
}

// MARK: - SwiftUI

public extension View {
    /// Applies a typography token: font, tracking, line height and casing.
    ///
    ///     Text("The Rings of Saturn").typography(.uiHeadline)
    func typography(_ token: TypographyToken) -> some View {
        modifier(TypographyModifier(token: token))
    }
}

public struct TypographyModifier: ViewModifier {
    private let token: TypographyToken

    @Environment(\.dynamicTypeSize) private var dynamicTypeSize

    public init(token: TypographyToken) {
        self.token = token
    }

    public func body(content: Content) -> some View {
        let traits = UITraitCollection(preferredContentSizeCategory: dynamicTypeSize.contentSizeCategory)
        let font = token.uiFont(compatibleWith: traits)
        // SwiftUI's lineSpacing sits *between* lines, on top of the font's own
        // line height — so the value we want is the difference, never negative.
        // Single lines are unaffected, which is what tab bars and buttons want.
        let leading = max(0, token.scaledLineHeight(compatibleWith: traits) - font.lineHeight)

        return content
            .font(Font(font as CTFont))
            .tracking(token.scaledTracking(compatibleWith: traits))
            .lineSpacing(leading)
            .textCase(token.isUppercased ? .uppercase : nil)
    }
}

private extension DynamicTypeSize {
    var contentSizeCategory: UIContentSizeCategory {
        switch self {
        case .xSmall: return .extraSmall
        case .small: return .small
        case .medium: return .medium
        case .large: return .large
        case .xLarge: return .extraLarge
        case .xxLarge: return .extraExtraLarge
        case .xxxLarge: return .extraExtraExtraLarge
        case .accessibility1: return .accessibilityMedium
        case .accessibility2: return .accessibilityLarge
        case .accessibility3: return .accessibilityExtraLarge
        case .accessibility4: return .accessibilityExtraExtraLarge
        case .accessibility5: return .accessibilityExtraExtraExtraLarge
        @unknown default: return .large
        }
    }
}

// MARK: - Diagnostics

/// Surfaces missing font faces in debug builds instead of letting them fail silently.
public enum TypographyDiagnostics {
    nonisolated(unsafe) private static var reported: Set<String> = []
    private static let lock = NSLock()

    static func reportMissingFont(named postScriptName: String, token: TypographyToken) {
        #if DEBUG
        lock.lock()
        defer { lock.unlock() }
        guard reported.insert(postScriptName).inserted else { return }
        print("""
        [Typography] Missing font "\(postScriptName)" for token "\(token.name)". \
        Falling back to the system font. Check that the \(token.family.displayName) \
        files are in the target and listed under UIAppFonts in Info.plist.
        """)
        #endif
    }

    /// Every PostScript name the tokens expect. Call once at launch in debug to
    /// verify the app actually ships the faces it references.
    public static func missingFontNames() -> [String] {
        var missing: [String] = []
        for family in TypographyToken.Family.allCases {
            for weight in TypographyToken.Weight.allCases {
                for italic in [false, true] {
                    let name = family.postScriptName(weight: weight, italic: italic)
                    if UIFont(name: name, size: 12) == nil, !missing.contains(name) {
                        missing.append(name)
                    }
                }
            }
        }
        return missing
    }
}

#endif
