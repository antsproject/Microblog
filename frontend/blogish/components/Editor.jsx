'use client';

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
            minHeight: `350px`
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
