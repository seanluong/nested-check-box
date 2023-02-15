import { useState } from "react";
import { cloneDeep } from "lodash";

export interface NestedCheckboxData {
    [key: string]: boolean | NestedCheckboxData;
}
  
export interface NestedChecboxProps {
    data: NestedCheckboxData;
}


interface NestedChecboxHelperProps {
    nodes: Node[];
    ancestors: string[];
    onBoxChecked: (e: React.FormEvent<HTMLInputElement>, ancestors: string[]) => void;
}

interface Node {
    label: string;
    checked: boolean;
    childrenNodes: Node[];
    parent?: Node;
}

const transform = (data: NestedCheckboxData, parent?: Node): Node[] =>  {
    return Object.keys(data).map((key: string) => {
        const value = data[key];
        const node = {
            label: key,
            checked: false,
            childrenNodes: [],
            parent: parent,
        } as Node;

        if (typeof value === "boolean") {
            node.checked = value;
        } else {
            const children = transform(value, node);
            node.childrenNodes = children;
            if (children.every((node) => node.checked)) {
                node.checked = true;
            }
        }

        return node;
    });
}

const updateAncestors = (node: Node) => {
    if (!node.parent) {
        return;
    }

    const parent = node.parent;
    if (parent.checked && !node.checked) {
        parent.checked = false;
        updateAncestors(parent);
        return;
    }

    if (!parent.checked && node.checked) {
        if (parent.childrenNodes.every((node) => node.checked)) {
            parent.checked = true;
            updateAncestors(parent);
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

const findNode = (nodes: Node[], label: string, ancestors: string[]) => {
    let node: Node | undefined = undefined;
    if (ancestors.length === 0) {
        return nodes.filter((node) => node.label === label)[0];
    }

    for (let ancestor of ancestors) {
        const candidates: Node[] = node ? node.childrenNodes : nodes;
        node = candidates.filter((node) => node.label === ancestor)[0];
    }
    return node?.childrenNodes.filter((node) => node.label === label)[0] as Node;
}

export const NestedCheckbox = ({ data }: NestedChecboxProps) => {
    const initialNodes = transform(data);
    const [ nodes, setNodes ] = useState(initialNodes);

    const handleBoxChecked = (e: React.FormEvent<HTMLInputElement>, ancestors: string[]) => {
        const checked = e.currentTarget.checked;
        const node = findNode(nodes, e.currentTarget.value, ancestors);

        node.checked = checked;
        toggleDescendants(node);
        updateAncestors(node);

        setNodes(cloneDeep(nodes));
    }

    return (
        <NestedCheckboxHelper nodes={nodes}  ancestors={[] as string[]} onBoxChecked={handleBoxChecked}/>
    );
}

const NestedCheckboxHelper = ({ nodes, ancestors, onBoxChecked }: NestedChecboxHelperProps) => {
    const prefix = ancestors.join(".");
    return (
        <ul>
            {
                nodes.map(({ label, checked, childrenNodes }) => {
                    const id = `${prefix}.${label}`;
                    let children: JSX.Element | null = null;
                    if (childrenNodes.length > 0) {
                        children = <NestedCheckboxHelper nodes={childrenNodes} ancestors={[...ancestors, label]} onBoxChecked={onBoxChecked} />
                    }

                    return (
                        <li key={id}>
                            <input type="checkbox" name={id} value={label} checked={checked} onChange={(e) => onBoxChecked(e, ancestors)}/>
                            <label htmlFor={id}>{label}</label>
                            {children}
                        </li>
                    )
                })
            }
        </ul>
    )
}
