<script lang="ts">
    import {Router, Route, Link, useNavigate} from "svelte-navigator";
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';
    import LoginComponent from "./LoginComponent.svelte";
    import BookCover from "./BookCover.svelte";
    import Cafe from "./Cafe.svelte";
    import {data} from "./store";
</script>

<Router>
<main>
    <Route path="/" component={LoginComponent} />
    <Route path="book" component={BookCover} />
    <Route path="cafe" component={Cafe} />
</main>
</Router>