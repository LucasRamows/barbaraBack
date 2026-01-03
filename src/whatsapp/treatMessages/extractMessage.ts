const extractMessages = (msgs: any[]): string[] => {
  const mensagens: string[] = [];

  const extractChildren = (node: any) => {
    if (!node) return;

    if (node.text) {
      mensagens.push(node.text);
    } else if (node.content?.richText) {
      node.content.richText.forEach(extractChildren);
    } else if (node.children) {
      node.children.forEach(extractChildren);
    }
  };

  msgs.forEach((msg) => extractChildren(msg));

  return mensagens;
};

export default extractMessages;