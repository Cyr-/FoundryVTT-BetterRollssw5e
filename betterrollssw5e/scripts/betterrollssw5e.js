import { SW5E } from "../../../systems/sw5e/module/config.js";
import { CustomRoll, CustomItemRoll } from "./custom-roll.js";
import { i18n, Utils, ItemUtils } from "./utils/index.js";
import { getSettings } from "./settings.js";

// Returns whether an item makes an attack roll
export function isAttack(item) {
	const attacks = ["mwak", "rwak", "mpak", "rpak"];
	return attacks.includes(item.data.data.actionType);
}

// Returns whether an item requires a saving throw
export function isSave(item) {
	const itemData = item.data.data,
		isTypeSave = itemData.actionType === "save",
		hasSaveDC = (itemData.save && itemData.save.ability) ? true : false;

	return isTypeSave || hasSaveDC;
}

export function isCheck(item) {
	return item.data.type === "tool" || typeof item.data.data?.proficient === "number";
}

/**
 * Function for adding Better Rolls content to html data made after a sheet is rendered.
 * actor				The actor object
 * html					The target html to add content to
 * triggeringElement	Container for the element that must be clicked for the extra buttons to be shown.
 * buttonContainer		Container for the element the extra buttons will display in.
 * itemButton			Selector for the item button.
 */
export function addItemContent(actor, html,
	triggeringElement = ".item .item-name h4",
	buttonContainer = ".item-properties",
) {
	if (game.settings.get("betterrollssw5e", "rollButtonsEnabled") && triggeringElement && buttonContainer) {
		addItemSheetButtons(actor, html, null, triggeringElement, buttonContainer)
	}
}

const sw5e = SW5E;

function getQuickDescriptionDefault() {
	return getSettings().quickDefaultDescriptionEnabled;
}

CONFIG.betterRollssw5e = {
	validItemTypes: [
		"weapon", "equipment", "consumable", "tool", //"loot", "backpack",
		"power",
		/*"class",*/ "classfeature", //"archetype",
		"feat",
		//"species",
		//"background",
		"deployment", "deploymentfeature", "venture",
		"fightingmastery", "fightingstyle", "lightsaberform",
		"starship", "starshipfeature", "starshipmod",
		],
	allFlags: {
		weaponFlags: {
			quickDesc: { type: "Boolean", get value() { return getQuickDescriptionDefault() }, get altValue() { return getQuickDescriptionDefault() } },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickVersatile: { type: "Boolean", value: false, altValue: false },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			quickCharges: { type: "Boolean", value: {quantity: false, use: false, resource: true}, altValue: {quantity: false, use: true, resource: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},
		equipmentFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			quickCharges: { type: "Boolean", value: {quantity: false, use: false, resource: true}, altValue: {quantity: false, use: false, resource: true} },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},
		consumableFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			// Consumables consume uses by default in vanilla 5e
			quickCharges: { type: "Boolean", value: {quantity: false, use: true, resource: true}, altValue: {quantity: false, use: true, resource: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},
		toolFlags: {
			quickDesc: { type: "Boolean", get value() { return getQuickDescriptionDefault() }, get altValue() { return getQuickDescriptionDefault() } },
			quickCheck: { type: "Boolean", value: true, altValue: true },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},

		powerFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickVersatile: { type: "Boolean", value: false, altValue: false },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			quickCharges: { type: "Boolean", value: {use: true, resource: true}, altValue: {use: true, resource: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},

		classfeatureFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			// Feats consume uses by default in vanilla 5e
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},
		featFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			// Feats consume uses by default in vanilla 5e
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},

		deploymentFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			// Feats consume uses by default in vanilla 5e
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},
		deploymentfeatureFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			// Feats consume uses by default in vanilla 5e
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},
		ventureFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			// Feats consume uses by default in vanilla 5e
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},

		fightingstyleFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},
		fightingmasteryFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},
		lightsaberformFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},

		starshipFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			// Feats consume uses by default in vanilla 5e
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},
		starshipfeatureFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			// Feats consume uses by default in vanilla 5e
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		},
		starshipmodFlags: {
			quickDesc: { type: "Boolean", value: true, altValue: true },
			quickAttack: { type: "Boolean", value: true, altValue: true },
			quickSave: { type: "Boolean", value: true, altValue: true },
			quickDamage: { type: "Array", value: [], altValue: [], context: [] },
			quickProperties: { type: "Boolean", value: true, altValue: true },
			// Feats consume uses by default in vanilla 5e
			quickCharges: { type: "Boolean", value: {use: true, resource: true, charge: true}, altValue: {use: true, resource: true, charge: true} },
			quickTemplate: { type: "Boolean", value: true, altValue: true },
			quickOther: { type: "Boolean", value: true, altValue: true, context: "" },
			quickFlavor: { type: "Boolean", value: true, altValue: true },
			quickPrompt: { type: "Boolean", value: false, altValue: false },
		}
	}
};

/**
 * Adds buttons and assign their functionality to the sheet
 * @param {String} triggeringElement - this is the html selector string that opens the description - mostly optional for different sheetclasses
 * @param {String} buttonContainer - this is the html selector string to which the buttons will be prepended - mostly optional for different sheetclasses
 */
export async function addItemSheetButtons(actor, html, data, triggeringElement = '', buttonContainer = '') {
	// Do not modify the sheet if the user does not have permission to use the sheet
	if (actor.permission < 3) { return; }

	// Setting default element selectors
	if (triggeringElement === '') triggeringElement = '.item:not(.enhanced-item) .item-name h4';
	if (buttonContainer === '') buttonContainer = '.item-properties';

	// adding an event for when the description is shown
	html.find(triggeringElement).click(event => {
		let li = $(event.currentTarget).parents(".item");
		addButtonsToItemLi(li, actor, buttonContainer);
	});

	for (let element of html.find(triggeringElement)) {
		let li = $(element).parents('.item:not(.enhanced-item)');
		addButtonsToItemLi(li, actor, buttonContainer);
	}
}

/**
 * Helper function for creating roll buttons.
 * @param {Object} button
 * @param {String} button.content - The text to display inside the button.
 * @param {String} button.action - The value of the data-action attribute.
 * @param {(String|Number|null)} [button.value=null] - The value of the data-value attribute.
 */
const createButton = ({ content, action, value = null }) => (
	`<span class="tag">
		<button data-action=${action} ${value == null ? "" : `data-value="${value}"`}>
			${content}
		</button>
	</span>`
)

async function addButtonsToItemLi(li, actor, buttonContainer) {
	const itemId = String(li.attr("data-item-id") ?? "");
	if (!itemId) {
		return;
	}

	const item = actor.items.get(itemId);
	const itemData = item.data.data;
	const flags = item.data.flags.betterRollssw5e;

	// Check settings
	const settings = getSettings();
	const contextEnabled = settings.damageContextPlacement !== "0" ? true : false;

	if (!li.hasClass("expanded")) return;  // this is a way to not continue if the items description is not shown, but its only a minor gain to do this while it may break this module in sheets that dont use "expanded"


	// Create the buttons
	let buttons = $(`<div class="item-buttons"></div>`);
	let buttonsWereAdded = false;

	// TODO: Make the logic in this switch statement simpler.
	switch (item.data.type) {
		case 'weapon':
		case 'feat':
		case 'power':
		case 'consumable':
			buttonsWereAdded = true;
			buttons.append(
				createButton({ content: i18n("br5e.buttons.roll"), action: "quickRoll" }),
				createButton({ content: i18n("br5e.buttons.altRoll"), action: "altRoll"})
			);

			if (isAttack(item)) {
				buttons.append(
					createButton({ content: i18n("br5e.buttons.attack"), action: "attackRoll"})
				);
			}

			if (isSave(item)) {
				const saveData = ItemUtils.getSave(item);

				buttons.append(
					createButton({
						content: `${i18n("br5e.buttons.saveDC")} ${saveData.dc} ${sw5e.abilities[saveData.ability]}`,
						action: "save"
					})
				);
			}

			if (itemData.damage.parts.length > 0) {
				buttons.append(
					createButton({ content: i18n("br5e.buttons.damage"), action: "damageRoll", value: "all" })
				);

				if (itemData.damage.versatile) {
					buttons.append(
						createButton({ content: i18n("br5e.buttons.verDamage"), action: "verDamageRoll", value: "all" })
					);
				}

				// Make a damage button for each damage type
				if (itemData.damage.parts.length > 1) {
					buttons.append(`<br>`);

					itemData.damage.parts.forEach(([_, damageType], i) => {
						const damageString =
							(contextEnabled && flags.quickDamage.context[i]) ||
							CONFIG.betterRollssw5e.combinedDamageTypes[damageType];

						let content = `${i}: ${damageString}`;

						if (i === 0 && itemData.damage.versatile) {
							content += ` (${sw5e.weaponProperties.ver})`;
						}

						buttons.append(
							createButton({ content, action: "damageRoll", value: i })
						);
					});
				}
			}

			if (itemData.formula.length > 0) {
				const otherString = contextEnabled && flags.quickOther.context || i18n("br5e.settings.otherFormula");

				buttons.append(
					createButton({ content: otherString, action: "otherFormulaRoll" })
				);
			}

			break;

		case 'tool':
			buttonsWereAdded = true;

			buttons.append(
				createButton({
					content: `${i18n("br5e.buttons.itemUse")} ${item.name}`,
					action: "toolCheck",
					value: itemData.ability.value
				})
			);

			if (itemData.formula && itemData.formula.length > 0) {
				const otherString = (contextEnabled && flags.quickOther.context) || i18n("br5e.settings.otherFormula");

				buttons.append(
					createButton({ content: otherString, action: "otherFormulaRoll" })
				);
			}

			break;
	}

	if (buttonsWereAdded) {
		buttons.append(`<br>`);
	}

	// Add info button
	buttons.append(
		createButton({ content: i18n("br5e.buttons.info"), action: "infoRoll" })
	);

	// Add default roll button
	buttons.append(
		createButton({ content: i18n("br5e.buttons.defaultSheetRoll"), action: "vanillaRoll" })
	);

	if (buttonsWereAdded) {
		buttons.append(`<br><header style="margin-top:6px"></header>`);
	}

	// adding the buttons to the sheet
	const targetHTML = li; //$(event.target.parentNode.parentNode)
	targetHTML.find(buttonContainer).prepend(buttons);

	// adding click event for all buttons
	buttons.find('button').click((ev) => {
		ev.preventDefault();
		ev.stopPropagation();

		// The arguments compounded into an object and an array of fields, to be served to the roll() function as the params and fields arguments
		const params = {forceCrit: ev.altKey, event: ev};
		const fields = [];
		if (params.forceCrit) {
			fields.push([
				"flavor",
				{ text: `${getSettings().critString}` }
			]);
		}

		// Sets the damage roll in the argument to the value of the button
		function setDamage(versatile = false) {
			if (ev.target.dataset.value === "all") {
				fields.push(["damage", { index:"all", versatile:versatile} ]);
			} else {
				fields.push(["damage", { index:Number(ev.target.dataset.value) }]);
			}
		}

		switch (ev.target.dataset.action) {
			case 'quickRoll':
				params.preset = 0; break;
			case 'altRoll':
				params.preset = 1; break;
			case 'attackRoll':
				fields.push(["attack"]); break;
			case 'save':
				fields.push(["savedc"]); break;
			case 'damageRoll':
				setDamage(); break;
			case 'verDamageRoll':
				setDamage(true); params.versatile = true; break;
			case 'toolCheck':
				fields.push(["toolcheck"]); break;
			case 'otherFormulaRoll':
				fields.push(["other"]); break;
			case 'infoRoll':
				fields.push(["header"], ["desc"]); params.consume = false; params.properties = true; break;
			case 'vanillaRoll':
				item.roll({ vanilla: true });
		}

		if (ev.target.dataset.action !== 'vanillaRoll') {
			new CustomItemRoll(item, params, fields).toMessage();
		}
	});
}

/** Frontend for macros */
export function BetterRolls() {
	async function assignMacro(item, slot, mode) {
		function command() {
			const vanilla = mode === 'vanillaRoll' ? "true" : "false";
			return `
// HotbarUses5e: ActorID="${item.actorId}" ItemID="${item.data._id}"
const actorId = "${item.actorId}";
const itemId = "${item.data._id}";
const actorToRoll = canvas.tokens.placeables.find(t => t.actor?.id === actorId)?.actor ?? game.actors.get(actorId);
const itemToRoll = actorToRoll?.items.get(itemId);

if (game.modules.get('itemacro')?.active && itemToRoll?.hasMacro() && game.settings.get('itemacro', 'defaultmacro')) {
	return itemToRoll.executeMacro();
}

if (!itemToRoll) {
	return ui.notifications.warn(game.i18n.format("SW5e.ActionWarningNoItem", { item: itemId, name: actorToRoll?.name ?? "[Not Found]" }));
}

return itemToRoll.roll({ vanilla: ${vanilla} });
`;
		}
		let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
		if (!macro) {
			macro = await Macro.create({
				name: item.data.name,
				type: "script",
				img: item.data.img,
				command: command(),
				flags: {"sw5e.itemMacro": true}
			}, {displaySheet: false});
		}
		game.user.assignHotbarMacro(macro, slot);
	};

	// Performs a vanilla roll message, searching the actor and item by ID.
	function vanillaRoll(actorId, itemId) {
		let actor = getActorById(actorId);
		if (!actor) { return ui.notifications.warn(`${i18n("br5e.error.noActorWithId")}`); }
		let item = actor.items.get(itemId);
		if (!item) { return ui.notifications.warn(`${i18n("br5e.error.noItemWithId")}`); }
		if (actor.permission != 3) { return ui.notifications.warn(`${i18n("br5e.error.noActorPermission")}`); }
		return item.roll({ vanilla: true, event });
	};

	// Performs a Quick Roll, searching for an item in the controlled actor by name.
	function quickRoll(itemName) {
		let speaker = ChatMessage.getSpeaker();
		let actor = getActorById(speaker.actor);
		let item = actor ? actor.items.find(i => i.name === itemName) : null;
		if (!actor) { return ui.notifications.warn(`${i18n("br5e.error.noSelectedActor")}`); }
		else if (!item) { return ui.notifications.warn(`${actor.name} ${i18n("br5e.error.noKnownItemOnActor")} ${itemName}`); }
		return item.roll({ vanilla: false, event });
	};

	// Performs a Quick Roll, searching the actor and item by ID.
	function quickRollById(actorId, itemId) {
		let actor = getActorById(actorId);
		if (!actor) { return ui.notifications.warn(`${i18n("br5e.error.noActorWithId")}`); }
		let item = actor.items.get(itemId);
		if (!item) { return ui.notifications.warn(`${i18n("br5e.error.noItemWithId")}`); }
		if (actor.permission != 3) { return ui.notifications.warn(`${i18n("br5e.error.noActorPermission")}`); }
		return item.roll({ vanilla: false, event });
	};

	// Performs a Quick Roll, searching the actor and item by name.
	function quickRollByName(actorName, itemName) {
		let actor = getActorByName(actorName);
		if (!actor) { return ui.notifications.warn(`${i18n("br5e.error.noKnownActorWithName")}`); }
		let item = actor.items.find(i => i.name === itemName);
		if (!item) { return ui.notifications.warn(`${actor.name} ${i18n("br5e.error.noKnownItemOnActor")} ${itemName}`); }
		if (actor.permission != 3) { return ui.notifications.warn(`${i18n("br5e.error.noActorPermission")}`); }
		return item.roll({ vanilla: false, event });
	};

	// Returns if an event should have its corresponding Quick Roll be an Alt Roll.
	function isAlt(event) {
		const { altSecondaryEnabled } = getSettings();
		return event && event.altKey && altSecondaryEnabled;
	};

	// Prefer synthetic actors over game.actors to avoid consumables and powers being missdepleted.
	function getActorById(actorId) {
		let actor = canvas.tokens.placeables.find(t => t.actor?.id === actorId)?.actor;
		if (!actor) actor = game.actors.get(actorId);
		return actor;
	}

	// Prefer token actors over game.actors to avoid consumables and powers being missdepleted.
	function getActorByName(actorName) {
		let actor = canvas.tokens.placeables.find(p => p.data.name === actorName)?.actor;
		if (!actor) actor = game.actors.find(e => e.name === actorName);
		return actor;
	}

	Hooks._hooks.hotbarDrop = [(bar, data, slot) => {
		if ( data.type !== "Item" ) return true;
		if (event && event.altKey) { // not using isAlt(event) because it's not related to alternative roll
			assignMacro(data, slot, "vanillaRoll");
		} else {
			assignMacro(data, slot, "id");
		}
		return false;
	}].concat(Hooks._hooks.hotbarDrop || []);

	return {
		version: Utils.getVersion(),
		assignMacro:assignMacro,
		vanillaRoll:vanillaRoll,
		quickRoll:quickRoll,
		quickRollById:quickRollById,
		quickRollByName:quickRollByName,
		addItemContent:addItemContent,
		rollCheck:CustomRoll.rollCheck,
		rollSave:CustomRoll.rollSave,
		rollSkill:CustomRoll.rollSkill,
		rollItem:CustomRoll.newItemRoll,
		getRollState: (params) => Utils.getRollState({ event, ...(params ?? {})}),

		// These are still here for compatibility, but will be removed in future versions
		hooks:{
			addActorSheet: () => {
				console.warn("WARNING: BetterRolls.hooks.addActorSheet() is deprecated");
			},
			addItemSheet: () => {
				console.warn("WARNING: BetterRolls.hooks.addItemSheet() is deprecated");
			},
		},
	};
}
