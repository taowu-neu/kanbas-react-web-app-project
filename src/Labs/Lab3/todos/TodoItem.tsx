import React from "react";

type TodoProps = {
    todo: {
        title: string;
        status: string;
        done: boolean;
    };
};

const TodoItem = ({ todo }: TodoProps) => {
    return (
        <li className="list-group-item">
            <input type="checkbox" className="me-2" defaultChecked={todo.done} />
            {todo.title} ({todo.status})
        </li>
    );
};

export default TodoItem;
