import {MoravecPlayer} from "../bots/MoravecPlayer";
import {CalculatorAssertions} from "./calculator_asserts";

export function gameSpec(spec) {

    // Check info helpers

    async function getCurrentTrialNumber() {
        const levelStateComponent = await spec.findComponent("LevelState");
        return levelStateComponent.props.currentTrialNumber;
    }

    // Assert helpers

    async function assertNoAnswerFeedbackIsShownToTheUser() {
        await spec.notExists('FeedbackMessage');
    }

    async function assertYouCanDoBetterMessageShown() {
        await spec.exists('YouCanDoBetterMessage');
    }

    async function assertCurrentTrialNumberIs(expectedTrialNumber) {
        const currentTrialNumber = await getCurrentTrialNumber();

        if (currentTrialNumber !== expectedTrialNumber) {
            throw Error(`Was expecting current trial to be number ${expectedTrialNumber}, 
                but it's showing ${currentTrialNumber}`);
        }
    }

    async function assertLevelSelectionScreenIsShown() {
        await spec.exists('LevelSelection');
    }

    async function assertPlayNextLevelIsShown() {
        await spec.exists('PlayNextButton');
    }

    async function assertPlayNextLevelIsNotShown() {
        await spec.notExists('PlayNextButton');
    }

    async function assertReplayLevelIsShown() {
        await spec.exists('ReplayButton');
    }

    async function assertGameScreenIsShown() {
        await spec.exists('Game');
    }

    // Spec

    spec.describe('As a user', async function () {
        const aPlayer = new MoravecPlayer(spec);
        const calculatorAsserts = new CalculatorAssertions(spec);

        spec.it("hitting the Play button should show me the level selection screen", async function () {
            await aPlayer.startGame();

            await assertLevelSelectionScreenIsShown();
        });

        spec.it("I can enter any number and it will be shown in the screen", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();

            await aPlayer.pressANumberSequence("1");

            await calculatorAsserts.assertOperationDisplayShows("1");
        });

        spec.it("I can enter a sequence of numbers and all the digits will be shown in the screen in correct order", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();

            await aPlayer.pressANumberSequence("135");

            await calculatorAsserts.assertOperationDisplayShows("135");
        });

        spec.it("hitting the Enter key without entering a number before does nothing", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();

            await aPlayer.pressEnter();

            await assertNoAnswerFeedbackIsShownToTheUser();
        });

        spec.it("hitting the Enter key with empty result does nothing", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();

            await aPlayer.pressANumberSequence("1");
            await aPlayer.pressErase();

            await aPlayer.pressEnter();

            await assertNoAnswerFeedbackIsShownToTheUser();
        });

        spec.it("entering a correct answer (before exceeding max solving time) shows an OK message and increases the trial counter", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();
            const previousTrialNumber = await getCurrentTrialNumber();

            await aPlayer.enterTheRightAnswer();

            await calculatorAsserts.assertCalculationOKMessageShown();
            await spec.pause(1000);
            await assertCurrentTrialNumberIs(previousTrialNumber + 1);
        });

        spec.it("entering a WRONG answer (before exceeding max solving time) shows a 'wrong' message and increases the trial counter", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();
            const previousTrialNumber = await getCurrentTrialNumber();

            await aPlayer.enterAWrongAnswer();

            await calculatorAsserts.assertCalculationWrongMessageShown();
            await spec.pause(1000);
            await assertCurrentTrialNumberIs(previousTrialNumber + 1);
        });

        spec.it("entering a WRONG answer out of time (max solving time exceeded) also shows the 'wrong' message and increases the trial counter", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();
            const previousTrialNumber = await getCurrentTrialNumber();

            await aPlayer.waitUntilMaxSolvingTimeIsExceeded();

            await aPlayer.enterAWrongAnswer();

            await calculatorAsserts.assertCalculationWrongMessageShown();
            await spec.pause(1000);
            await assertCurrentTrialNumberIs(previousTrialNumber + 1);
        });

        spec.it("entering a correct answer out of time (max solving time exceeded) shows a 'you can do better' message and does NOT increase the trial counter", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();
            const previousTrialNumber = await getCurrentTrialNumber();

            await aPlayer.waitUntilMaxSolvingTimeIsExceeded();

            await aPlayer.enterTheRightAnswer();

            await assertYouCanDoBetterMessageShown();
            await spec.pause(1000);
            await assertCurrentTrialNumberIs(previousTrialNumber);
        });

        spec.it("entering 15 or more trials correct allows me to play next level", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();

            for (let i = 1; i <= 15; i++) {
                await aPlayer.enterTheRightAnswer();
            }

            for (let i = 1; i <= 5; i++) {
                await aPlayer.enterAWrongAnswer();
            }

            await assertPlayNextLevelIsShown();
        });

        spec.it("entering 14 or less trials correct DOES NOT allow me to play next level", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();

            for (let i = 1; i <= 14; i++) {
                await aPlayer.enterTheRightAnswer();
            }

            for (let i = 1; i <= 6; i++) {
                await aPlayer.enterAWrongAnswer();
            }

            await assertPlayNextLevelIsNotShown();
        });

        spec.it("pressing replay level allows shows me the calculator again", async function () {
            await aPlayer.startGame();
            await aPlayer.playFirstLevel();

            for (let i = 1; i <= 20; i++) {
                await aPlayer.enterAWrongAnswer();
            }

            await assertReplayLevelIsShown();

            await aPlayer.pressReplayLevel();

            await assertGameScreenIsShown();
        });
    })
}
