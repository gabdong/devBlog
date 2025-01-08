import { ICommand } from '@uiw/react-md-editor';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import rehypeSanitize from 'rehype-sanitize';

import useModal from '@hooks/useModal';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function Editor({ ...props }: EditorProps) {
  const { openModal } = useModal();
  const [defaultCommands, setDefaultCommands] = useState<ICommand<string>[]>(
    [],
  );

  // 이미지 추가 커스텀
  const customImageCommand: ICommand<string> = {
    name: 'image',
    keyCommand: 'Image',
    buttonProps: { 'aria-label': 'Add image', title: 'Add image' },
    execute: () => {
      openModal({
        type: 'addImage',
        props: { callBackType: 'editor', setEditorState: props.onChange },
      });
    },
  };

  useEffect(() => {
    (async () => {
      const getDefaultCommands = async () => {
        const importLibrary = await import('@uiw/react-md-editor');
        return importLibrary.getCommands();
      };
      const defaultCommands = await getDefaultCommands();
      const defaultCommandsLength = defaultCommands.length;

      for (let i = 0; i < defaultCommandsLength; i++) {
        const item = defaultCommands[i];
        if (item.name == 'image' && item.icon) {
          customImageCommand.icon = item.icon;
          defaultCommands[i] = { ...customImageCommand };
        }
      }
      setDefaultCommands(defaultCommands);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div data-color-mode="dark">
      <MDEditor
        value={props.value}
        onChange={props.onChange}
        height={props.height}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        commands={[...defaultCommands]}
      />
    </div>
  );
}
