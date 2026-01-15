const extractMessages = (msgs: any[]): string[] => {
  const messages: string[] = [];

  const extractChildren = (node: any, buffer: string[]) => {
    if (!node) return;

    if (typeof node.text === "string") {
      buffer.push(node.text);
    }

    if (node.content?.richText) {
      node.content.richText.forEach((child: any) =>
        extractChildren(child, buffer)
      );
    }

    if (node.children) {
      node.children.forEach((child: any) =>
        extractChildren(child, buffer)
      );
    }
  };

  for (const msg of msgs) {
    const buffer: string[] = [];
    extractChildren(msg, buffer);

    // junta sem adicionar espaços extras
    const finalText = buffer.join("\n");

    messages.push(finalText);
  }

  return messages;
};

export default extractMessages