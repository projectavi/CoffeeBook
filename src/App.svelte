<script lang="ts">
    import {Router, Route, Link, useNavigate} from "svelte-navigator";
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';
    import LoginComponent from "./LoginComponent.svelte";
    import BookCover from "./BookCover.svelte";
    import Cafe from "./Cafe.svelte";
    import TransitionContainer from "./TransitionContainer.svelte";
    import CafePreferences from "./CafePreferences.svelte";
    import QueryPage from "./QueryPage.svelte";

</script>

<Router>
<main>
    <TransitionContainer>
        <Route path="/" component={LoginComponent} />
        <Route path="book" component={BookCover} />
        <Route path="cafe" component={Cafe} />
        <Route path="preferences" component={CafePreferences} />
        <Route path="query" component={QueryPage} />
    </TransitionContainer>
</main>
</Router>