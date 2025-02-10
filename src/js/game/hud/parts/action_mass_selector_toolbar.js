import { HUDActionToolbar } from "./action_toolbar";


export class HUDMassSelectorToolbar extends HUDActionToolbar {
    constructor(root) {
        super(root);

        this.actions = [
            {
                id: "cut",
                label: "剪切",
                icon: "icons/notification_error.png",
                action: this.onCut.bind(this)
            },
            {
                id: "copy",
                label: "复制",
                icon: "icons/tutorial_arrow.png",
                action: this.onCopy.bind(this)
            },
            {
                id: "clean",
                label: "清理",
                icon: "icons/notification_info.png",
                action: this.onClean.bind(this)
            },
            {
                id: "delet",
                label: "删除",
                icon: "icons/notification_info.png",
                action: this.onClean.bind(this)
            },
        ];
    }

    visibilityCondition() {
        return true;
        // const currentMetaBuilding = this.root.hud.parts.buildingPlacer.currentMetaBuilding;
        // return currentMetaBuilding.get() !== null;
    }

    /**
     * Handles the copy action.
     */
    onCopy() {
        // Implement copy logic here
        this.root.soundProxy.playUiClick();
        console.log("Copy action triggered");
    }

    /**
     * Handles the cut action.
     */
    onCut() {
        // Implement cut logic here
        this.root.soundProxy.playUiClick();
        console.log("Cut action triggered");
    }

    /**
     * Handles the paste action.
     */
    onPaste() {
        // Implement paste logic here
        this.root.soundProxy.playUiClick();
        console.log("Paste action triggered");
    }

    /**
     * Handles the clean action.
     */
    onClean() {
        // Implement clean logic here
        this.root.soundProxy.playUiClick();
        console.log("Clean action triggered");
    }
}
