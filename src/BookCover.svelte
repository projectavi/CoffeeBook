<script lang="ts">
	import Cafe from './Cafe.svelte';
	import { focus } from './focus'
	export let name: string;

	let cafeObjs = [{name: "Plearn", rating: 0.0, atmosphere: 0.0, drinks: [{name: "Test", ratingAttributes: ["Espresso"], ratingScores: [0.0], ratingWeights: [10]}]}];
	let coffeeObjs = [];
	// This is temporary, grab from the document passed from login

	let cafes = [];

	cafeObjs.forEach((obj) => {
		cafes.push(obj["name"]);
	});

	let cafe_name: string;
	let drink_name: string;

	let filteredCafes = [];

	const filterCafes = () => {
		let tempArr = [];
		if (cafeInputValue) {
			cafes.forEach(cafe => {
				if (cafe.toLowerCase().startsWith(cafeInputValue.toLowerCase())) {
					tempArr = [...tempArr, makeMatchBold(cafe)];
				}
			})
		}
		filteredCafes = tempArr;
	}

	let cafeSearchInput;
	let cafeInputValue = "";

	$: if (!cafeInputValue) {
		filteredCafes = [];
		hiLiteIndex = null;
	}

	const clearCafeInput = () => {
		cafeInputValue = "";
		cafeSearchInput.focus();
	}

	const setCafeInputVal = (cafeName) => {
		cafeInputValue = removeBold(cafeName);
		filteredCafes = [];
		hiLiteIndex = null;
		document.querySelector('#cafe-input');
	}

	const submitValue = () => {
		if (cafeInputValue) {
			console.log("Submitted: " + cafeInputValue);
			setTimeout(() => {
				clearCafeInput();
			}, 1000);
		// Route to the page for the cafe
		}
		else {
			alert("Please enter the required information");
		}
	}

	const makeMatchBold = (str) => {
		let matched = str.substring(0, cafeInputValue.length);
		let makeBold = `<strong>${matched}</strong>`;
		let boldedMatch = str.replace(matched, makeBold);
		return boldedMatch;
	}

	const removeBold = (str) => {
		//replace < and > all characters between
		return str.replace(/<(.)*?>/g, "");
		// return str.replace(/<(strong)>/g, "").replace(/<\/(strong)>/g, "");
	}

	let hiLiteIndex = null;
	$: hiLitedCafe = filteredCafes[hiLiteIndex];

	const navigateList = (e) => {
		if (e.key === "ArrowDown" && hiLiteIndex <= filteredCafes.length-1) {
			hiLiteIndex === null ? hiLiteIndex = 0 : hiLiteIndex += 1
		} else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
			hiLiteIndex === 0 ? hiLiteIndex = filteredCafes.length-1 : hiLiteIndex -= 1
		} else if (e.key === "Enter") {
			setCafeInputVal(filteredCafes[hiLiteIndex]);
		} else {
			return;
		}
	}
</script>

<main>
	<div id="main">
		<div id="leftcol">
			<h1> Add a drink </h1>
<!-- Add a text input drop down-->
			<form autocomplete="off" on:submit|preventDefault={submitValue}>
				<div class="autocomplete">
					<input id="cafe-input"
						   type="text"
						   placeholder="Search Cafe Names"
						   bind:this={cafeSearchInput}
						   bind:value={cafeInputValue}
						   on:input={filterCafes}>
				</div>

				<!-- FILTERED LIST OF COUNTRIES -->
				{#if filteredCafes.length > 0}
					<ul id="autocomplete-items-list">
						{#each filteredCafes as cafe, i}
							<Cafe itemLabel={cafe} highlighted={i === hiLiteIndex} on:click={() => setCafeInputVal(cafe)} />
						{/each}
					</ul>
				{/if}

				<input type="submit" value="Add Rating">
			</form>
			<input type="text" placeholder="Drink Name" bind:value={drink_name}>

		</div>
		<div id="rightcol">
			<h> Table of Values </h>
		</div>
	</div>
</main>

<style>

	main {

		/* Fill the screen */
		margin: 0px;
		padding: 0px;
		min-height: 100%;
		min-width: 100%;
		height: 100%;
		width: 100%;
		background-color: #023047;

	}

	#main {
	/*	Align contents horizontally */
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	#leftcol {
	/*	Align contents vertically */
	/*	Align contents in the center of the div*/
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	/*	Add right padding */
		padding-right: 10px;
	}

	#rightcol {
	/*	Align contents vertically */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	/*	Add left padding */
		padding-left: 10px;
	}

	/*div.autocomplete {*/
	/*	!*the container must be positioned relative:*!*/
	/*	position: relative;*/
	/*	display: inline-block;*/
	/*	width: 300px;*/
	/*}*/
	input {
		border: 1px solid transparent;
		background-color: #f1f1f1;
		padding: 10px;
		font-size: 16px;
		margin: 0;
	}
	input[type=text] {
		background-color: #f1f1f1;
		width: 100%;
	}
	input[type=submit] {
		background-color: DodgerBlue;
		color: #fff;
	}

	#autocomplete-items-list {
		position: relative;
		margin: 0;
		padding: 0;
		top: 0;
		width: 297px;
		border: 1px solid #ddd;
		background-color: #ddd;
	}

</style>