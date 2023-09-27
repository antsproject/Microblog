"use client";

import {BlockNoteEditor} from "@blocknote/core";
import {BlockNoteView, useBlockNote} from "@blocknote/react";
import "@blocknote/core/style.css";


export default function Editor() {
    const editor: BlockNoteEditor | null = useBlockNote({});
    return <BlockNoteView editor={editor}/>;
}
