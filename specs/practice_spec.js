import {MoravecPlayer} from "./bots/MoravecPlayer";
import {CalculatorAssertions} from "./game/calculator_asserts";

export function practiceSpec(spec) {

    async function assertPracticeLevelSelectionScreenIsShown() {
        await spec.exists('PracticeModeSelection');
    }

    // Spec

    spec.describe('As a user', async function () {
        const aPlayer = new MoravecPlayer(spec);
        const calculatorAsserts = new CalculatorAssertions(spec);

        spec.it("hitting the Practice button should show me the practice selection screen", async function () {
            await aPlayer.startPractice();

            await assertPracticeLevelSelectionScreenIsShown();
        });

        spec.it("I can enter any number and it will be shown in the screen", async function () {
            await aPlayer.startPractice();
            await aPlayer.selectAPracticeLevel();

            await aPlayer.pressANumberSequence("1");

            await calculatorAsserts.assertOperationDisplayShows("1");
        });

        spec.it("entering a correct answer shows an OK message", async function () {
            await aPlayer.startPractice();
            await aPlayer.selectAPracticeLevel();

            await aPlayer.enterTheRightAnswer();

            await calculatorAsserts.assertCalculationOKMessageShown();
        });

        spec.it("entering a WRONG answer shows a 'wrong' message", async function () {
            await aPlayer.startPractice();
            await aPlayer.selectAPracticeLevel();

            await aPlayer.enterAWrongAnswer();

            await calculatorAsserts.assertCalculationWrongMessageShown();
        });
    })
}
