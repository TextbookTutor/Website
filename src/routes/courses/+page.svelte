<script>
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
        courses2 = await fetch("/getdata").then((res) => res.json());
    })

</script>


<h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl px-5 lg:text-6xl dark:text-white">
    Courses
</h1>

<div class="overflow-x-auto content-center px-5">
    <table class="table table-zebra w-mid">
        <thead>
        <tr>
            <th>Textbook Name</th>
            <th>Chapters</th>
            <th>Sections</th>
        </tr>
        </thead>

        <tbody>
        {#if courses2}
            {#each courses2 as course}
                <tr>
                    <td>{course.course_title}</td>
                    <td>{course.chapters.length}</td>
                    <td>{course.chapters.reduce((acc, cur) => acc + cur.sections.length, 0)}</td>
                    <td>
                        <a href="/courses/{course._id.$oid}">
                            <button class="btn btn-success">
                                Open
                            </button>
                        </a>

                    </td>
                </tr>
            {/each}
        {/if}

        </tbody>
    </table>
    <!--    <a href="#createmodal">-->
    <!--        <button class="btn btn-primary">-->
    <!--            Create New Course-->
    <!--        </button>-->
    <!--    </a>-->
    <button class="btn btn-primary" onclick={()=>my_modal_1.showModal()}>Upload PDF</button>
    <dialog id="my_modal_1" class="modal">
        <div class="modal-box">

            <div class="modal-action">
                <form action="?/avatar" method="post" enctype="multipart/form-data">
                    <input type="file" name="avatar" placeholder="avatar" />
                    <button class="btn btn-success" type="submit">Upload</button>
                </form>
                <form method="dialog">
                    <button class="btn btn-error">Close</button>
                </form>
            </div>
        </div>
    </dialog>
</div>