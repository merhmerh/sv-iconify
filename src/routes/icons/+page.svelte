<script>
import IconList from "./IconList.svelte";
import { setIconListState } from "./IconList.svelte.js";
import Iconsets from "./Iconsets.svelte";

setIconListState();
</script>

<Iconsets />
<IconList />
