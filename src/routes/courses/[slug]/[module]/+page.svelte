<script>
    import '../../../../app.css';

    import { page } from '$app/stores';
    let module = {
        moduleType: "quiz",
        questions: [{
            question: "What is 2+2?",
            questionOptions: ["4","3","5","2"],
            answerIndex: 0,
        },
            {
                question: "What is 2+2?",
                questionOptions: ["4","3","5","2"],
                answerIndex: 0,
            },
            {
                question: "What is 2+2?",
                questionOptions: ["4","3","5","2"],
                answerIndex: 0,
            }
            ,
            {
                question: "What is 2+2?",
                questionOptions: ["4","3","5","2"],
                answerIndex: 0,
            }]
    }
    let activeIndex = 0;
</script>

<div class="join">
    {#each {length: module.questions.length} as _, i}
        {#if i === activeIndex}
            <button class="join-item btn btn-active">{i}</button>
        {:else}
            <button class="join-item btn">{i}</button>
        {/if}
    {/each}
</div>

<h1>
    {module.questions[activeIndex].question}
</h1>
{#each module.questions[activeIndex].questionOptions as option, i}
    <p>
        {i}) {option}
        <input type="radio" name="radio-1" class="radio" />
    </p>
{/each}

