import { useState } from "react";
import { cloneDeep } from "lodash";
import { NestedChecboxHelperProps, NestedChecboxProps, Node } from "./types";
import { findNode, toggleDescendants, transform, updateAncestors } from "./util";

export const NestedCheckbox = ({ data }: NestedChecboxProps) => {
    const initialNodes = transform(data);
    const [ nodes, setNodes ] = useState(initialNodes);

    const handleBoxChecked = (e: React.FormEvent<HTMLInputElement>, ancestors: Node[]) => {
        const checked = e.currentTarget.checked;
        const node = findNode(nodes, e.currentTarget.value, ancestors);

        node.checked = checked;
        toggleDescendants(node);
        updateAncestors(node, ancestors);

        setNodes(cloneDeep(nodes));
    }

    return (
        <NestedCheckboxHelper nodes={nodes}  ancestors={[] as Node[]} onBoxChecked={handleBoxChecked}/>
    );
}

const NestedCheckboxHelper = ({ nodes, ancestors, onBoxChecked }: NestedChecboxHelperProps) => {
    const prefix = ancestors.join(".");
    return (
        <ul>
            {
                nodes.map((node) => {
                    const { label, checked, childrenNodes } = node;
                    const id = `${prefix}.${label}`;
                    let children: JSX.Element | null = null;
                    if (childrenNodes.length > 0) {
                        children = <NestedCheckboxHelper nodes={childrenNodes} ancestors={[...ancestors, node]} onBoxChecked={onBoxChecked} />
                    }

                    return (
                        <li key={id}>
                            <input type="checkbox" name={id} value={label} checked={checked} onChange={(e) => onBoxChecked(e, [...ancestors])}/>
                            <label htmlFor={id}>{label}</label>
                            {children}
                        </li>
                    )
                })
            }
        </ul>
    )
}
