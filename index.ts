import { Extension, api, type } from 'clipcc-extension';
import requirePackage from 'requirePackage';
const fs = requirePackage('fs');
const path = requirePackage('path');

type SimpleBlockPrototype = {
    opcode: string;
    type: type.BlockType;
    param?: { [key: string]: type.ParameterPrototype };
    function: Function;
}

class FileSystemExtension extends Extension {
    public onInit() {
        api.addCategory({
            categoryId: this.categoryId,
            messageId: 'alexcui.filesystem.category',
            color: '#44B28F'
        });

        this.makeBlock({
            opcode: 'currentPath',
            type: type.BlockType.REPORTER,
            function: () => path.resolve('./')
        });

        this.makeBlock({
            opcode: 'exists',
            type: type.BlockType.BOOLEAN,
            param: {
                path: { type: type.ParameterType.STRING }
            },
            function: (args: { path: string; }) => fs.existsSync(args.path)
        });

        this.makeBlock({
            opcode: 'createFile',
            type: type.BlockType.COMMAND,
            param: {
                path: { type: type.ParameterType.STRING }
            },
            function: (args: { path: string; }) => {
                fs.writeFileSync(args.path, '');
            }
        });

        this.makeBlock({
            opcode: 'writeFileWithModeAsync',
            type: type.BlockType.COMMAND,
            param: {
                data: { type: type.ParameterType.STRING },
                path: { type: type.ParameterType.STRING },
                mode: { type: type.ParameterType.STRING }
            },
            function: (args: { path: string; data: string; mode: string; }) => {
                fs.writeFile(args.path, args.data, { flag: args.mode }, () => {
                    // TODO: ERROR
                });
            }
        });

        this.makeBlock({
            opcode: 'readFileSync',
            type: type.BlockType.REPORTER,
            param: {
                path: { type: type.ParameterType.STRING }
            },
            function: (args: { path: string; }) => fs.readFileSync(args.path)
        });
    }

    private makeBlock(prototype: SimpleBlockPrototype) {
        const opcode = `alexcui.filesystem.${prototype.opcode}`;
        api.addBlock({
            opcode: opcode,
            type: prototype.type,
            messageId: opcode,
            categoryId: this.categoryId,
            param: prototype.param,
            function: prototype.function
        });
    }

    private get categoryId() {
        return 'alexcui.filesystem.category'
    }
}

export default FileSystemExtension;
