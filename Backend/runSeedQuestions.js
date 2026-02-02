
import seedDatabase from "./seedExamQuestions.js";

seedDatabase().then((result) => {
    if (result.success) {
        console.log(result.message);
        process.exit(0);
    } else {
        console.error(result.message);
        process.exit(1);
    }
});
