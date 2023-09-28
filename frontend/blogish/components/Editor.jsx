'use client';

import {Block, BlockNoteEditor} from "@blocknote/core";
import {
    BlockNoteView,
    lightDefaultTheme,
    useBlockNote,

} from "@blocknote/react";
import "@blocknote/core/style.css";

const theme = {
    ...lightDefaultTheme,
    componentStyles: (theme) => ({
        Editor: {
            backgroundColor: theme.colors.editor.background,
            borderRadius: theme.borderRadius,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: `0 4px 12px ${theme.colors.shadow}`,
            height: `350px`
        },
        Menu: {
            ".mantine-Menu-item[data-hovered], .mantine-Menu-item:hover": {
                backgroundColor: "charcoal",
            },
        },
        Toolbar: {
            ".mantine-Menu-dropdown": {
                ".mantine-Menu-item:hover": {
                    backgroundColor: "charcoal",
                },
            },
        },
    }),
};

export default function Editor() {
    const editor = useBlockNote();
    return <BlockNoteView editor={editor} theme={theme}/>
}
