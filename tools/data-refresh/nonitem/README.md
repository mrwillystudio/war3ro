# RO Atlas 7.0c08-v48 non-item data refresh

This is the reproducible non-item part of the 2026-11-21 website update. It reads the immutable uploaded map extraction and the previous published runtime dataset. It does not edit the map, models, textures, or game values.

## Inputs and invocation

`nonitem_refresh.py --work WORK_DIR` expects:

- `current_rodb.json`: the prior production dataset after its existing JavaScript overlays have executed.
- `items_patch.json`: the current item builder output, with an `items` array. This constrains public shop offers to real catalog items, excluding quest and transfer menu entries.
- `map_extract/extracted/war3map.j` and the parsed `objects_w3u.json`, `objects_w3a.json`, and `objects_w3t.json` under `map_extract/`.
- `map_extract/native_unit_127.json`, `native_ability_127.json`, `native_item_127.json`, with provenance recorded by the extractor in `native_provenance.json`.

The native data are pinned Warcraft III 1.27.1 Custom defaults. Each object resolves as the **unmodified native parent plus that object's own map modifications**. A custom unit must never inherit the map's modified original unit sharing its parent ID. Explicit zero values and empty strings remain overrides.

Outputs are written to `WORK_DIR/data_audit/`: `nonitem_patch.json`, `nonitem_audit.json`, `resolved_units.json`, `resolved_abilities.json`, and `purchase_aliases.json`.

Keep `reviewed_summon_guides.json` next to the generator. It contains the individually reviewed event requirements and current evidence for 25 guide records, including Illusion Lord's object-level summon chain (`Ubal.uabi` → `A02D.Hwe1`). The generator supplies six other verified guides directly. The snapshot is bound to the exact extracted JASS SHA-256 and deliberately fails on another script revision until the visible conditions are reviewed again. Guide object evidence is checked against the raw current unit and ability modifications.

The integration builder applies the patch to its copied dataset and adds the independently rebuilt item data and model previews. Then run `check_final.py --work WORK_DIR` against `final_rodb.json`. The checker compares direct and inherited prices/stats against native parent records, checks actual JASS source lines and every displayed summon guide's line/function/text evidence, preserves existing recipe IDs, validates references and mode requirements, and verifies that the 40 manual areas and 836 mapped placements are unchanged. Both commands require an explicit `--work`; no machine-specific absolute path is embedded.

## Source definitions

- Unit values come from native parent records and `war3map.w3u` modifications. Hero HP and attack use actual configured creation levels, primary attributes, and map STR/AGI constants; `objectLevel` remains separate from the visible name's declared level or actual hero level.
- Attack enablement and both weapons' target lists come from their own object fields plus native defaults. Bird Egg has no enabled ordinary attack. Green Ferus has two enabled weapons: its first weapon's map override permits ground and air enemies, while its second weapon retains the native air target list. `secondaryAttack` keeps the second weapon's distinct damage, range, and cooldown.
- Ability fields come from native defaults and `war3map.w3a`; `areq` is the requirement ID and `arqa` is its amount. `Rhpm` identifies rage-only abilities. Tooltip placeholders are resolved only when a numeric source field exists; unknown placeholders remain explicit.
- Regular item drops are parsed from `Trig_Npc_Drop_Item_Initialization_Actions`. A threshold out of 1000 becomes percent; the leisure multiplier applies only where the code actually multiplies by it.
- MVP pools come from active `RODrop_Config_*` functions, `RODrop_Pool`, and `RODrop_Candidate`. Displayed item probability is pool activation probability multiplied by candidate weight divided by total weight. Shared pools retain `exclusivePool`, `exclusivePick`, and `exclusiveOf`. Death thresholds are checked against the runtime increment/reload order. UNMR's leisure branch performs two non-capsule reward calls; its displayed probabilities are per roll and the two rolls are annotated.
- Recipes include the 60 normal merge recipes and the 18 forging recipes. A stored charge requirement of zero means one non-stacking item. Forging requires `A0I6`; its current action has no failure roll. Existing `recipe-1` through `recipe-60` IDs remain stable; forging uses separate `forge-N` IDs.
- Shop offers come from actual neutral NPC/building placements and their current `usei` lists. `Purchasable` entries map through `ihtp` to `udg_it_BUY_ITEM`. Offers preserve both the sold menu ID and physical item ID; the item builder supplies the price of the sold menu. Explicit GM and non-catalog menu actions are excluded. Unverified quest unlock conditions are noted on the relevant offers.
- Seven real set memberships are checked against their current condition functions. Direct positive integer and ability-level changes are reparsed from `Trig_SET_Actions`; this restores the omitted FLEE skill-level +5 for the shadow set. Holy-guard set code in this section only stores piece count, so downstream combat use is explicitly left unverified.
- JASS `Rect` definitions are refreshed. Hand-corrected area polygons and mapped placements remain unchanged, including the 12 deliberately superseded raw positions. Dynamic new encounters are described separately and are not fabricated as fixed spawn points.
- All 31 displayed summon guides have been checked for their stated materials, counts, modes, timings and thresholds. Illusion Lord is confirmed as Dark Lord's `A02D` summon: two units, zero mana and 600-second skill cooldown; the exact AI casting timing remains explicitly unconfirmed, so cooldown is not presented as a fixed spawn schedule. Nightmare Amon Ra requires four upgraded artifacts and retains them; the normal seal entrance waits 20 seconds. The mode-selection handler disables that seal in leisure and MVP-story modes, so the guide does not misrepresent the unreachable leisure branch inside its spawn function as a player-accessible entrance. Leisure's 30-minute automatic call generates normal Amon Ra. Turtle altar placement is matched independently by location and item, without chronological ordering; the ordinary revival countdown is followed by a 20-second announcement.
- The guide review also corrects the tower's combined two-route thresholds (10 for Hydrolancer and 15 for Ifrit), the two Phoenix spawns accompanying Ifrit, the Halloween/non-Halloween Dragon event probabilities (1/3 versus 1/2), the five living Sight/Sight-Rasher unit records needed by Orc Hero, and the Devil Box origin of Rybio. Displayed citations retain current line/function/text evidence; existing hand-authored assertions are never promoted to verified merely because a similarly named function exists.
- Nightmare Amon Ra's stable runtime RGBA `[85,110,230,217]` is recorded in separate preview fields with its `NMR_Summon` source. Object `modelColor` remains the native/object value. The preview renderer handles appearance, not this extraction module.

## Scope and limitations

The build is specifically reviewed for `Ro-Online 7.0c08-v48.w3x`; it contains explicit handling for the new King Poring and Nightmare Turtle encounters, the Randgris phase transition, and existing published catalog semantics. Review those assumptions before applying it to another map revision.

Previously authored detailed battle-mechanic descriptions are retained with a previous-version reference status when their complete trigger branches have not been reverified. NPC unlock conditions and downstream holy-guard set combat formulas are similarly identified. Model provenance and rendering are handled separately by the model-preview pipeline; this module does not manufacture or modify previews.

Do not commit the uploaded map, extracted map resources, native game data, or binary models with this tool. Commit only the generator, verification code, audit summaries, and website assets authorized for publication.
