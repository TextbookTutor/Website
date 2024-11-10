<script lang="ts">
    import {page} from '$app/stores';
    import '../../../app.css';
    import {onMount} from "svelte";

    let chapters;
    let name;
    let completions;
    onMount(async () => {
        let courses2 = await fetch("/getdata").then((res) => res.json());
        chapters = courses2.find(course => course._id.$oid === $page.params.slug).chapters;
        name = courses2.find(course => course._id.$oid === $page.params.slug).course_title;
        let fetchCompletions = localStorage.getItem(`textbook-tutor-${$page.params.slug}`);
        if (!fetchCompletions) {
            let blankCompletions = chapters.map((chapter) => ({
                title: chapter.chapter_title,
                sections: chapter.sections.map(section => ({
                    title: section.section_title,
                    score: null
                }))
            }));
            localStorage.setItem(`textbook-tutor-${$page.params.slug}`, JSON.stringify(blankCompletions));
            completions = blankCompletions;
        } else {
            completions = JSON.parse(fetchCompletions);
        }

        chapters.forEach((chapter, i) => {
            chapter.sections.forEach((section, j) => {
                section.score = completions[i].sections[j].score;
            });
        });
    });
</script>

<div class="container mx-auto px-8 py-10">
    {#if name}
        <h1 class="text-center text-5xl font-bold mb-8 text-gray-100">{name}</h1>
    {/if}

    {#if chapters}
        {#each chapters as chapter,i}
            <div tabindex="-1" class="collapse collapse-arrow bg-base-200 mb-4 shadow-lg rounded-lg">
                <input type="checkbox" class="hidden"/>
                <div class="collapse-title text-2xl font-semibold text-gray-100">
                    {i+1}. {chapter.chapter_title}
                </div>
                <div class="collapse-content bg-gray-800 p-6 rounded-lg">
                    <div class="overflow-x-auto">
                        <table class="table table-auto w-full">
                            <thead>
                            <tr class="text-gray-300 bg-gray-700">
                                <th class="py-3 px-6 text-left">Module</th>
                                <th class="py-3 px-6 text-left">Type</th>
                                <th class="py-3 px-6 text-left">Score</th>
                                <th class="py-3 px-6 text-center">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {#each chapter.sections as section, i}
                                <tr class="hover:bg-gray-700">
                                    <td class="py-4 px-6 text-gray-200">{section.section_title}</td>
                                    <td class="py-4 px-6 text-gray-400">Quiz</td>
                                    <td class="py-4 px-6 text-gray-200">{section.score ? section.score + "%" : ""}</td>
                                    <td class="py-4 px-6 text-center">
                                        <a href="/courses/{$page.params.slug}/quiz-{encodeURIComponent(chapter.chapter_title)}-{i}">
                                            {#if section.score == null}
                                                <button class="btn btn-success btn-sm">Start</button>
                                            {:else}
                                                <button class="btn btn-primary btn-sm">Retry</button>
                                            {/if}
                                        </a>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-700">
                                    <td class="py-4 px-6 text-gray-200">{section.section_title}</td>
                                    <td class="py-4 px-6 text-gray-400">Activity</td>
                                    <td class="py-4 px-6 text-gray-200">N/A</td>
                                    <td class="py-4 px-6 text-center">
                                        <a href="/courses/{$page.params.slug}/free-{encodeURIComponent(chapter.chapter_title)}-{i}">
                                            <button class="btn btn-success btn-sm">Start</button>
                                        </a>
                                    </td>
                                </tr>
                            {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        {/each}
    {/if}
</div>
