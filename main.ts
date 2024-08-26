import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!


export class SharedStuff {
	/**
	 * Creates a new instance of the SharedStuff class.
	 * @param stuff - The initial data to be stored in the SharedStuff instance.
	 */
	constructor(private stuff: {[key: string]: any;}) {
		this.stuff = stuff
	}

	/**
	 * Sets a value in the shared data collection.
	 * @param name - The name of the value to set.
	 * @param value - The value to set.
	 */
	set(name: string, value: any) {
		this.stuff[name] = value;
	}

	/**
	 * Retrieves a value from the shared data collection.
	 * @param name - The name of the value to retrieve.
	 * @returns The value associated with the specified name, or undefined if the name does not exist.
	 */
	get(name: string) {
		return this.stuff[name];
	}

	/**
	 * Deletes a value from the shared data collection.
	 * @param name - The name of the value to delete.
	 */
	delete(name: string) {
		delete this.stuff[name];
	}

	/**
	 * Checks if a value exists in the shared data collection.
	 * @param name - The name of the value to check.
	 * @returns True if the value exists, false otherwise.
	 */
	has(name: string) {
		return this.stuff.hasOwnProperty(name);
	}

	/**
	 * Retrieves an array of all the keys in the shared data collection.
	 * @returns An array of keys.
	 */
	keys() {
		return Object.keys(this.stuff);
	}

	/**
	 * Retrieves an array of all the values in the shared data collection.
	 * @returns An array of values.
	 */
	values() {
		return Object.values(this.stuff);
	}

	/**
	 * Retrieves an array of all the key-value pairs in the shared data collection.
	 * @returns An array of key-value pairs.
	 */
	entries() {
		return Object.entries(this.stuff);
	}
}

/**
 * Represents shared stuff.
 */
const sharedstuff = new SharedStuff({})

interface FloatingGifSettings {
	file: string;
}

const DEFAULT_SETTINGS: FloatingGifSettings = {
	file: ''
}

export default class FloatingGif extends Plugin {
	settings: FloatingGifSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new FloatingGifSettingTab(this.app, this));
		let float_gif = document.body.createEl("img", "floating display")
		sharedstuff.set("float_gif", float_gif)
		float_gif.src = this.app.vault.adapter.getResourcePath(this.settings.file)
	}

	onunload() {
		sharedstuff.get("float_gif").remove()
		sharedstuff.delete("float_gif")
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class FloatingGifSettingTab extends PluginSettingTab {
	plugin: FloatingGif;

	constructor(app: App, plugin: FloatingGif) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		new Setting(containerEl)
			.setName('GIF File')
			.setDesc('Select a GIF file from your vault.')
			.addText(text => text
				.setPlaceholder('Enter file path')
				.setValue(this.plugin.settings.file)
				.onChange(async (value) => {
					this.plugin.settings.file = value;
					await this.plugin.saveSettings();
					sharedstuff.get("float_gif").src = this.app.vault.adapter.getResourcePath(value);
				}))
		
	}
}
