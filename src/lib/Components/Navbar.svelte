<script>
    let loggedIn = true;
    import '../../app.css';

</script>

<div class="navbar bg-base-100">
    <div class="flex-1">
        <a class="btn btn-ghost text-xl" href="/">📚Textbook Tutor</a>
    </div>
    <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
            {#if loggedIn}
                <li>
                    <a>
                        🔥&nbsp 1
                    </a>
                </li>
                <li><a href="/courses">Courses</a></li>
                <li>
                    <details>
                            <summary>Account</summary>
                            <ul class="bg-base-100 rounded-t-none p-2">
                                <li><a>Settings</a></li>
                                <li><a>Log Out</a></li>
                            </ul>
                    </details>
                </li>
            {:else}
                <li><a>About</a></li>
                <li><a>Pricing</a></li>
            {/if}
        </ul>
    </div>
</div>


