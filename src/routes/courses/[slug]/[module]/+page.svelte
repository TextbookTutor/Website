<script lang="ts">
    import '../../../../app.css';
    import {page} from '$app/stores';
    import {onMount} from "svelte";

    let chapters;
    let chapter;
    let module;
    let name;
    let answersInputed;
    let complete = false;
    let moduleType = $page.params.module.split('-')[0];
    let completions;

    onMount(async () => {
        let courses2 = await fetch("/getdata").then((res) => res.json());
        chapters = courses2.find(course => course._id.$oid === $page.params.slug).chapters;
        chapter = chapters.find(chapter => chapter.chapter_title === decodeURIComponent($page.params.module.split('-')[1]));
        module = chapter.sections[$page.params.module.split('-')[2]];
        name = courses2.find(course => course._id.$oid === $page.params.slug).course_title;
        answersInputed = new Array(module.mcqs.length);
        completions = JSON.parse(localStorage.getItem(`textbook-tutor-${$page.params.slug}`));
    });

    let activeIndex = 0;
    let selectedAnswer = -1;
    let questionsAnswered: number[] = [];

    function handleResponse() {
        if (selectedAnswer !== -1) {
            questionsAnswered.push(activeIndex);
            questionsAnswered = questionsAnswered;
            answersInputed[activeIndex] = selectedAnswer;

            // Auto-advance to next question if not on last question
            if (activeIndex < module.mcqs.length - 1) {
                activeIndex++;
                selectedAnswer = -1;
            } else {
                complete = true;
            }
        }
    }

    function scoreReport() {
        let correct = 0;
        for (let i = 0; i < answersInputed.length; i++) {
            if (answersInputed[i] === module.mcqs[i].answer) {
                correct++;
            }
        }
        completions.find(chapter => chapter.title === $page.params.module.split('-')[1])
            .sections[+$page.params.module.split('-')[2]].score = scoreNumeric();
        localStorage.setItem(`textbook-tutor-${$page.params.slug}`, JSON.stringify(completions));
        return `You got ${correct}/${answersInputed.length} answers correct.`;
    }

    function scoreNumeric() {
        let correct = 0;
        for (let i = 0; i < answersInputed.length; i++) {
            if (answersInputed[i] === module.mcqs[i].answer) {
                correct++;
            }
        }
        return Math.trunc(correct/answersInputed.length*100);
    }

    function getModuleQuestionLength() {
        if (module) return module.mcqs.length;
        return 10;
    }

    $: complete = (questionsAnswered.length === getModuleQuestionLength());
</script>

<!-- Quiz styles -->
<style>
    .quiz-container {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: rgb(17, 24, 39);
        color: #f5f5f5;
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .question-nav {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .nav-button {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        background-color: rgb(31, 41, 55);
        color: #fff;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }

    .nav-button.active {
        background-color: rgb(59, 130, 246);
    }

    .question {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 2rem;
        color: #fff;
    }

    .options-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .option-button {
        width: 100%;
        padding: 1rem;
        text-align: left;
        background-color: rgb(31, 41, 55);
        border: 4   px solid transparent;
        border-radius: 0.5rem;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s;
    }

    .option-button:hover {
        background-color: rgb(55, 65, 81);
    }

    .option-button.selected {
        border-color: rgb(96, 165, 250);
    }

    .option-button.correct {
        background-color: rgb(22, 101, 52);
    }

    .option-button.incorrect {
        background-color: rgb(185, 28, 28);
    }

    .score-container {
        text-align: center;
        margin-bottom: 2rem;
    }

    .score-text {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .submit-button {
        width: 100%;
        padding: 1rem;
        background-color: rgb(59, 130, 246);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .submit-button:hover {
        background-color: rgb(37, 99, 235);
    }

    /* Quiz Container for FRQ */
    .quiz-container {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: rgb(17, 24, 39);
        color: #f5f5f5;
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    /* Title for FRQ Section */
    .section-title {
        font-size: 2rem;
        font-weight: 600;
        text-align: center;
        margin-bottom: 2rem;
    }

    /* Free Response Questions Container */
    .frq-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    /* Each Free Response Question */
    .frq-item {
        background-color: rgb(31, 41, 55);
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* FRQ Question Text */
    .frq-question {
        font-size: 1.25rem;
        font-weight: 500;
        color: #fff;
        margin-bottom: 1rem;
        display: block;
    }

    /* Textarea for Answers */
    .frq-input {
        width: 100%;
        padding: 1rem;
        border-radius: 0.5rem;
        border: none;
        background-color: rgb(55, 65, 81);
        color: #fff;
        resize: vertical;
        font-size: 1rem;
        transition: background-color 0.2s;
    }

    /* Textarea on Focus */
    .frq-input:focus {
        background-color: rgb(31, 41, 55);
        outline: none;
    }

    /* Submit Button */
    .submit-button {
        width: 100%;
        padding: 1rem;
        background-color: rgb(59, 130, 246);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .submit-button:hover {
        background-color: rgb(37, 99, 235);
    }


</style>

{#if module}
    {#if moduleType === 'quiz'}
        <div class="quiz-container">
            {#if !complete}
                <!-- Question navigation -->
                <div class="question-nav">
                    {#each {length: module.mcqs.length} as _, i}
                        <button
                                class="nav-button {i === activeIndex ? 'active' : ''}"
                                on:click={() => activeIndex = i}
                        >
                            {i + 1}
                        </button>
                    {/each}
                </div>

                <!-- Question -->
                <h2 class="question">
                    {module.mcqs[activeIndex].question}
                </h2>

                <!-- Options -->
                <div class="options-container">
                    {#if !questionsAnswered.includes(activeIndex)}
                        {#each module.mcqs[activeIndex].options as option, i}
                            <button
                                    class="option-button {selectedAnswer === i ? 'selected' : ''}"
                                    on:click={() => selectedAnswer = i}
                            >
                                {option}
                            </button>
                        {/each}
                        <button
                                class="submit-button"
                                on:click={handleResponse}
                                disabled={selectedAnswer === -1}
                        >
                            Submit
                        </button>
                    {:else}
                        {#each module.mcqs[activeIndex].options as option, i}
                            <button
                                    class="option-button"
                                    disabled={true}
                            >
                                {option}
                            </button>
                        {/each}
                    {/if}
                </div>
            {:else}
                <!-- Score Report -->
                <div class="score-container">
                    <div class="radial-progress text-primary" style="--value:{scoreNumeric()};" role="progressbar">
                        {scoreNumeric()}%
                    </div>
                    <p class="score-text">{scoreReport()}</p>
                </div>

                <!-- Review navigation -->
                <div class="question-nav">
                    {#each {length: module.mcqs.length} as _, i}
                        <button
                                class="nav-button {i === activeIndex ? 'active' : ''}"
                                on:click={() => activeIndex = i}
                        >
                            {i + 1}
                        </button>
                    {/each}
                </div>

                <!-- Review answers -->
                <div class="options-container">
                    {#each module.mcqs[activeIndex].options as option, i}
                        <button
                                class="option-button {i === module.mcqs[activeIndex].answer ? 'correct' : 'incorrect'}"
                                disabled={true}
                        >
                            {option}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
        <div class="flex justify-center items-center">
            <a href="/courses/{$page.params.slug}">
                <button class="btn btn-primary">{`<- Back to Modules`}</button>
            </a>
        </div>
    {:else}
        <div class="quiz-container">
            <div class="options-container">
                {#each module.frqs as frq, i}
                    <div class="frq-item">
                        <label for="response-{i}" class="frq-question">{frq.question}</label>
                        <textarea
                                id="response-{i}"
                                class="frq-input"
                                placeholder="Your answer here..."
                                bind:value={frq.answer}
                        ></textarea>
                    </div>
                {/each}
            </div>
        </div>

        <div class="flex justify-center items-center min-h-screen">
            <a href="/courses/{$page.params.slug}">
                <button class="btn btn-primary">{`<- Back to Modules`}</button>
            </a>
        </div>
    {/if}
{/if}