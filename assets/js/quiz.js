"use strict";
const App = (function Quiz($) {
	const SECOND = 1000;

	const countDown = function(seconds) {

		let milliSeconds = seconds * SECOND;

		const tick = function() {
			milliSeconds -= SECOND;
			convertToDisplay(milliSeconds);
			if(milliSeconds > 0) {
				setTimeout(tick, SECOND);
			}
		};

		tick();
	};

	const convertToDisplay = function(milliSeconds) {
		let seconds = Math.floor(milliSeconds/1000);
		$("#seconds").text(seconds);
	};

	let responseBank = {};
	let responseCount = 0;
	let randomBank = [];
	const questionBank = [
		{
			id: "0",
			question: "What is your favorite color?",
			answer: "No. Blue!",
			options: ["Red", "No. Blue!", "Green", "Yellow"],
		},
		{
			id: "1",
			question: "What does JSON stand for?",
			answer: "Javascript Object Notation",
			options: [
				"Javascript Object Notation",
				"Javascript Objective Network",
				"Javas Stupid Oompa Notification",
				"Jawas smell overly nice"],
		},
		{
			id: "2",
			question: "Who is Spiderman?",
			answer: "Peter Parker",
			options: [
				"Peter Parker",
				"J. Jonah Jameson",
				"Aunt May",
				"Harry Osborn",
			],
		},
		{
			id: "3",
			question: "What is the largest species of terrestrial crab in the world?",
			answer: "The coconut crab (Birgus latro)",
			options: [
				"The coconut crab (Birgus latro)",
				"King Crab",
				"Mr. Krabby",
				"Connecticut Crab Cakes",
			],
		},
		{
			id: "4",
			question: "Do you want ants?!",
			answer: "Because this is how we get ants.",
			options: [
				"Because this is how we get ants.",
				"Because I will give you ants.",
				"Because I like ants.",
				"Maybe I should watch more Archer.",
			],
		},
	];

	const shuffle = function(array) {
		let currentIndex = array.length
		let temporaryValue;
		let randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};

	const buildRadio = function(option, index) {
		let identifier = "radio-" + index;
		let $radio = $("<input>");

		$radio.addClass("form-check-input");
		$radio.attr("id", identifier);
		$radio.attr("name", "radio-group");
		$radio.attr("type", "radio");
		$radio.val(option);

		return $radio;
	};

	const buildOption = function(option, index) {
		let $check = $("<div>");
		let $label = $("<label>");
		let $radio = buildRadio(option, index);

		$check.addClass("form-check");
		$label.addClass("form-check-label");

		$label.append($radio);
		$label.append(option);
		$check.append($label);

		return $check;
	};

	const drawQuestion = function(question) {
		let options = shuffle(question.options);
		let $content = $("<fieldset>");
		let $legend = $("<legend>");
		let $col = $("<div>");

		$content.addClass("form-group row");
		$legend.addClass("col-form-legend col-md-12 question");
		$legend.attr("id", "question");
		$legend.attr("data-q", question.id);
		$legend.text(question.question);
		$col.addClass("col-md-12");

		options.forEach(function(opt, index) {
			$col.append(buildOption(opt, index));
		});

		$content.append($legend);
		$content.append($col);

		$(".content").html($content);
	};

	var storeResponse = function($selected) {
		const $question = $("#question");

		const questionId = $question.attr("data-q");

		responseBank[questionId] = {};
		responseBank[questionId].answer = $selected.val();
		responseBank[questionId].questionId = questionId;
	};

	const endGame = function() {
		console.log(responseBank);
	};

	const next = function() {
		const $selected = $("input[name=radio-group]:checked");

		if($selected.val() && responseCount < randomBank.length - 1) {

			storeResponse($selected);
			responseCount++;
			drawQuestion(questionBank[responseCount]);

		} else if($selected.val() && responseCount === randomBank.length - 1) {

			storeResponse($selected);
			endGame();

			$("#start-btn").show();
			$("#next-btn").hide();
		}
	};

	const start = function() {
		$("#start-btn").hide();
		$("#next-btn").show();

		drawQuestion(questionBank[responseCount]);
		countDown(30);
	};

	var init = function() {
		$("#start-btn").on("click", start);
		$("#next-btn").on("click", next);
		randomBank = shuffle(questionBank);
	};

	init();
}(window.jQuery));
