import { HUDActionToolbar } from "./action_toolbar";


export class HUDMassSelectorActionToolbar extends HUDActionToolbar {
    constructor(root) {
        super(root);

        this.actions = [
            {
                id: "copy",
                label: "复制",
                icon: "icons/copy.png",
                action: this.onCopy.bind(this)
            },
            {
                id: "cut",
                label: "剪切",
                icon: "icons/cut.png",
                action: this.onCut.bind(this)
            },
            {
                id: "clear",
                label: "清理",
                icon: "icons/clear.png",
                action: this.onClear.bind(this)
            },
            {
                id: "delete",
                label: "删除",
                icon: "icons/remove.png",
                action: this.onDelete.bind(this)
            },
            {
                id: "cancel",
                label: "取消",
                icon: "icons/notification_error.png",
                action: this.onCancel.bind(this)
            },
            // {
            //     id: "paste",
            //     label: "粘贴",
            //     icon: "icons/paste.png",
            //     action: this.onPaste.bind(this)
            // },
        ];
    }

    visibilityCondition() {
        const keybindingOverlay = this.root.hud.parts.keybindingOverlay;
        return keybindingOverlay.anythingSelectedOnMap;
    }

    /**
     * Handles the copy action.
     */
    onCopy() {
        // Implement copy logic here
        this.root.soundProxy.playUiClick();
        console.log("Copy action triggered");

        const selector = this.root.hud.parts.massSelector;
        selector.startCopy();
    }

    /**
     * Handles the cut action.
     */
    onCut() {
        // Implement cut logic here
        this.root.soundProxy.playUiClick();
        console.log("Cut action triggered");

        const selector = this.root.hud.parts.massSelector;
        selector.confirmCut();
    }

    /**
     * Handles the clear action.
     */
    onClear() {
        // Implement clear logic here
        this.root.soundProxy.playUiClick();
        console.log("Clear action triggered");

        const selector = this.root.hud.parts.massSelector;
        selector.clearBelts();
    }

    /**
     * Handles the delete action.
     */
    onDelete() {
        // Implement delete logic here
        this.root.soundProxy.playUiClick();
        console.log("Delete action triggered");

        const selector = this.root.hud.parts.massSelector;
        selector.confirmDelete();
    }

    /**
     * Handles the Cancel action.
     */
    onCancel() {
        // Implement Cancel logic here
        this.root.soundProxy.playUiClick();
        console.log("Cancel action triggered");

        const selector = this.root.hud.parts.massSelector;
        selector.onBack();
    }

    // /**
    //  * Handles the paste action.
    //  */
    // onPaste() {
    //     // Implement paste logic here
    //     this.root.soundProxy.playUiClick();
    //     console.log("Paste action triggered");
    // }
}
