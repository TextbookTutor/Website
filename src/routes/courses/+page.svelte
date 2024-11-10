<script lang="ts">
    // Sample data for courses
    import {onMount} from "svelte";

    let file;
    const authorizedExtensions = ["pdf"];
    let courses = [
        {name:"Math 234", lastVisited:"2024-01-01", progress:"80%",id:"abc123"},
        {name:"Math 232", lastVisited:"2024-01-01", progress:"80%", id:"123abc"},
    ];
    let courses2;
    onMount(async () => {
        courses2 = await fetch("https://localhost:8000/getdata").then((res) => res.json());
    })
</script>

<div class="min-h-screen bg-base-200 p-8">
    <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl font-bold text-center mb-12 dark:text-white">
            Courses
        </h1>

        <div class="card bg-base-100 shadow-xl">
            <div class="card-body p-6">
                <div class="overflow-x-auto">
                    <table class="table w-full">
                        <!-- Table header -->
                        <thead>
                        <tr class="bg-base-200">
                            <th class="text-base">Textbook Name</th>
                            <th class="text-base text-center">Chapters</th>
                            <th class="text-base text-center">Sections</th>
                            <th class="text-base text-center">Actions</th>
                        </tr>
                        </thead>

                        <!-- Table body -->
                        <tbody>
                        {#if courses2}
                            {#each courses2 as course}
                                <tr class="hover:bg-base-200 transition-colors">
                                    <td class="font-medium">{course.course_title}</td>
                                    <td class="text-center">{course.chapters.length}</td>
                                    <td class="text-center">
                                        {course.chapters.reduce((acc, cur) => acc + cur.sections.length, 0)}
                                    </td>
                                    <td class="text-center">
                                        <a href="/courses/{course._id.$oid}">
                                            <button class="btn btn-success btn-sm">
                                                Open
                                            </button>
                                        </a>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                        </tbody>
                    </table>
                </div>

                <!-- Action buttons -->
                <div class="flex justify-center gap-4 mt-6">
                    <button
                            class="btn btn-primary"
                            onclick={()=>my_modal_1.showModal()}
                    >
                        Upload PDF
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Upload Modal -->
<dialog id="my_modal_1" class="modal">
    <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Upload PDF Document</h3>
        <div class="modal-action flex flex-col gap-4">
            <form action="?/avatar" method="post" enctype="multipart/form-data" class="w-full">
                <div class="form-control w-full mb-4">
                    <input
                            type="file"
                            name="avatar"
                            placeholder="avatar"
                            class="file-input file-input-bordered w-full"
                    />
                </div>
                <div class="flex justify-end gap-2">
                    <button class="btn btn-success" type="submit">Upload</button>

                        <button class="btn btn-error">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</dialog>