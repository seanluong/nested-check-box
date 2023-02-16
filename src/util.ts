import { NestedCheckboxData, Node } from "./types";

const transform = (data: NestedCheckboxData): Node[] =>  {
    return Object.keys(data).map((key: string) => {
        const value = data[key];
        const node = {
            label: key,
            checked: false,
            childrenNodes: [],
        } as Node;

        if (typeof value === "boolean") {
            node.checked = value;
        } else {
            const children = transform(value);
            node.childrenNodes = children;
            if (children.every((node) => node.checked)) {
                node.checked = true;
            }
        }

        return node;
    });
}

const updateAncestors = (node: Node, ancestors: Node[]) => {
    if (ancestors.length === 0) {
        return;
    }
    
    const parent = ancestors.pop() as Node;

    if (parent.checked && !node.checked) {
        parent.checked = false;
        updateAncestors(parent, ancestors);
        return;
    }

    if (!parent.checked && node.checked) {
        if (parent.childrenNodes.every((node) => node.checked)) {
            parent.checked = true;
            updateAncestors(parent, ancestors);
            return;
        }
    }

    return;
}

const toggleDescendants = (node: Node) => {
    const checked = node.checked;

    node.childrenNodes.forEach((node) => {
        node.checked = checked;
        toggleDescendants(node);
    })
}

const findNode = (nodes: Node[], label: string, ancestors: Node[]) => {
    if (ancestors.length === 0) {
        return nodes.filter((node) => node.label === label)[0];
    }

    const ancestor = ancestors[ancestors.length - 1];
    let node = ancestor.childrenNodes.filter((node) => node.label === label)[0];
    return node;
}


const generateData = (depth: number, fanOut: number): NestedCheckboxData => {
    const node = {} as NestedCheckboxData;
    for (let i=0; i < fanOut ;i++) {
        const key = `d_${depth}-n_${i}`;
        if (depth === 1) {
            const value = Math.random() > 0.5 ? true : false;
            node[key] = value;
        } else {
            const childNode = generateData(depth-1, fanOut);
        node[key] = childNode;
        }
    }
    return node;
}


export {
    transform, updateAncestors, toggleDescendants, findNode, generateData
};