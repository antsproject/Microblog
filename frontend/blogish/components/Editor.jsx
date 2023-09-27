'use client';

import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';

export default function Editor() {
  const editor = useBlockNote({});
  return <BlockNoteView editor={editor} />;
}
