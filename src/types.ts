
interface NestedCheckboxData {
    [key: string]: boolean | NestedCheckboxData;
}
  
interface NestedChecboxProps {
    data: NestedCheckboxData;
}

interface NestedChecboxHelperProps {
    nodes: Node[];
    ancestors: Node[];
    onBoxChecked: (e: React.FormEvent<HTMLInputElement>, ancestors: Node[]) => void;
}

interface Node {
    label: string;
    checked: boolean;
    childrenNodes: Node[];
}

export type {
    NestedCheckboxData, NestedChecboxProps, NestedChecboxHelperProps, Node
};