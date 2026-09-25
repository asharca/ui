import ts from "typescript";
import { staticResourcePath, withBasePath } from "./paths";

/** Apply deployment-only URL changes to the temporary site, never library
 * components or the published registry source. Next Link handles its own prefix. */
export function transformSiteSource(source: string, filename: string, siteUrl: string, basePath: string) {
  const kind = /\.[jt]sx$/.test(filename) ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, kind);
  const prefix = (value: string) => withBasePath(staticResourcePath(value), basePath);
  const transformed = ts.transform(file, [(context) => {
    const visit: ts.Visitor = (node) => {
      if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
        const name = node.name.getText(file);
        const tag = node.parent.parent;
        const nativeLink = (ts.isJsxOpeningElement(tag) || ts.isJsxSelfClosingElement(tag)) && ["a", "link"].includes(tag.tagName.getText(file));
        if (name === "src" || name === "href" && nativeLink) {
          return ts.factory.updateJsxAttribute(node, node.name, ts.factory.createStringLiteral(prefix(node.initializer.text)));
        }
      }
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "fetch") {
        const first = node.arguments[0];
        if (first && ts.isStringLiteral(first) && first.text === "/api/github-stars") {
          return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [ts.factory.createStringLiteral(prefix(first.text)), ...node.arguments.slice(1)]);
        }
        if (first && ts.isIdentifier(first) && first.text === "markdownPath") {
          const path = ts.factory.createConditionalExpression(
            ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(first, "startsWith"), undefined, [ts.factory.createStringLiteral("/")]),
            ts.factory.createToken(ts.SyntaxKind.QuestionToken),
            ts.factory.createBinaryExpression(ts.factory.createStringLiteral(basePath), ts.SyntaxKind.PlusToken, first),
            ts.factory.createToken(ts.SyntaxKind.ColonToken), first,
          );
          return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [path, ...node.arguments.slice(1)]);
        }
      }
      if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "URL" && node.arguments?.[0] && ts.isStringLiteral(node.arguments[0]) && node.arguments[0].text === "/workspace") {
        return ts.factory.updateNewExpression(node, node.expression, node.typeArguments, [ts.factory.createStringLiteral(prefix("/workspace/")), ...node.arguments.slice(1)]);
      }
      if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && node.text.startsWith("/api/og")) {
        return ts.factory.createStringLiteral(`${siteUrl}/api/og.png`);
      }
      if (ts.isTemplateExpression(node) && node.head.text.startsWith("/api/og")) {
        return ts.factory.createStringLiteral(`${siteUrl}/api/og.png`);
      }
      // The copy menu uses a native anchor with a variable Markdown path.
      if (ts.isPropertyAssignment(node) && node.name.getText(file) === "href" && ts.isIdentifier(node.initializer) && node.initializer.text === "markdownPath") {
        return ts.factory.updatePropertyAssignment(node, node.name, ts.factory.createConditionalExpression(
          ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(node.initializer, "startsWith"), undefined, [ts.factory.createStringLiteral("/")]),
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          ts.factory.createBinaryExpression(ts.factory.createStringLiteral(basePath), ts.SyntaxKind.PlusToken, node.initializer),
          ts.factory.createToken(ts.SyntaxKind.ColonToken), node.initializer,
        ));
      }
      // Endpoint descriptors in the agent guide and static manifest fields.
      if (ts.isStringLiteral(node) && ts.isPropertyAssignment(node.parent)) {
        const name = node.parent.name.getText(file);
        if (name === "url" && node.text.startsWith("/r")) return ts.factory.createStringLiteral(staticResourcePath(node.text));
        if (name === "src" || name === "start_url" || name === "manifest") return ts.factory.createStringLiteral(prefix(node.text));
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (root) => ts.visitNode(root, visit) as ts.SourceFile;
  }]);
  try { return ts.createPrinter().printFile(transformed.transformed[0] as ts.SourceFile); }
  finally { transformed.dispose(); }
}
