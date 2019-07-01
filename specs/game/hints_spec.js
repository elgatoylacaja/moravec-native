import {MoravecPlayer} from "../bots/MoravecPlayer";

export function operationHintsSpec(spec) {
    // Spec

    async function assertHintCardIsShown() {
        await spec.exists('HintCard');
    }

    async function assertHintCardIsNotShown() {
        await spec.notExists('HintCard');
    }

    async function assertHintsTextContentIs(expectedText) {
        const hintsComponent = await spec.findComponent('Hints');

        const textShown = hintsComponent.hintsText();

        if (expectedText !== textShown) {
            throw Error(`Was expecting to display ${expectedText} on screen, but it's showing ${textShown}`);
        }
    }

    spec.describe('As a user', async function () {
        const aPlayer = new MoravecPlayer(spec);

        spec.it("asking for a hint for an operation without hints does nothing", async function () {
            await aPlayer.startGame();

            await aPlayer.playFirstLevel();
            await assertHintsTextContentIs("3/3");
            await assertHintCardIsNotShown();

            await spec.pause(1500);

            await aPlayer.pressAskForHintButton();

            await assertHintsTextContentIs("3/3");
            await assertHintCardIsNotShown();
        });

        // TODO
        // Find a way to set a specific operation / play a level were operations are not random,
        // to test this the scenarios below. Until then, this is commented out.

        // spec.it("asking for a hint for an operation shows a the hint", async function () {
        //     await aPlayer.startGame();
        //
        //     await aPlayer.playFirstLevel();
        //     await assertHintsTextContentIs("3/3");
        //     await assertHintCardIsNotShown();
        //
        //     // TODO: set a 2-digit multiplication operation for the current trial
        //
        //     await setOperationForCurrentTrial(Multiplication.createRandom(new OperationCategory("2x1")));
        //
        //     await aPlayer.pressAskForHintButton();
        //
        //     await assertHintsTextContentIs("2/3");
        //     await assertHintCardIsShown();
        // });
        //
        // spec.it("asking for a second hint for the same operation does nothing", async function () {
        //     await aPlayer.startGame();
        //
        //     await aPlayer.playFirstLevel();
        //     await assertHintsTextContentIs("3/3");
        //     await assertHintCardIsNotShown();
        //
        //     // TODO: set a 2-digit multiplication operation for the current trial
        //
        //     await aPlayer.pressAskForHintButton();
        //     await aPlayer.pressAskForHintButton();
        //
        //     await assertHintsTextContentIs("2/3");
        //     await assertHintCardIsShown();
        // });
        //
        // spec.it("asking for a hint when there are no remaining hints does nothing", async function () {
        //     await aPlayer.startGame();
        //     await aPlayer.playFirstLevel();
        //     await assertHintsTextContentIs("3/3");
        //     await assertHintCardIsNotShown();
        //
        //     // TODO: set a 2-digit multiplication operation for the current trial
        //
        //     await aPlayer.pressAskForHintButton();
        //     await aPlayer.enterTheRightAnswer();
        //
        //     // TODO: set a 2-digit multiplication operation for the current trial
        //
        //     await aPlayer.pressAskForHintButton();
        //     await aPlayer.enterTheRightAnswer();
        //
        //     // TODO: set a 2-digit multiplication operation for the current trial
        //
        //     await aPlayer.pressAskForHintButton();
        //     await aPlayer.enterTheRightAnswer();
        //
        //     await aPlayer.pressAskForHintButton();
        //
        //     await assertHintsTextContentIs("0/3");
        //     await assertHintCardIsNotShown();
        // });
    })
}
