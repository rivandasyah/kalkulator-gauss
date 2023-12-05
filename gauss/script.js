google.charts.load("current", {
	packages: ["corechart"],
});

MathJax = {
	tex: {
		inlineMath: [
			["$", "$"],
			["\\(", "\\)"],
		],
	},
};

function rumus() {
	var rumusElement = document.getElementById("ref-rumus");

	if (rumusElement.style.display === "none") {
		rumusElement.style.display = "block";
	} else {
		rumusElement.style.display = "none";
	}
}

function hitung() {
	var mean = parseFloat(document.getElementById("mean").value);
	var stdDev = parseFloat(document.getElementById("stdDev").value);
	var x = parseFloat(document.getElementById("x").value);

	console.log(mean);

	if (isNaN(mean) || isNaN(stdDev) || isNaN(x)) {
		alert("Lengkapi Input");
	} else {
		var data = new google.visualization.DataTable();
		data.addColumn("number", "X");
		data.addColumn("number", "Probabilitas");
		data.addColumn({ type: "string", role: "style" });

		for (var i = mean - 3 * stdDev; i <= mean + 3 * stdDev; i += 0.1) {
			var probabilitas = distribusiNormal(i, mean, stdDev);
			var style = "";
			if (i < x) {
				style = "color: blue";
			} else if (i > x) {
				style = "color: red";
			}
			data.addRow([i, probabilitas, style]);
		}

		drawChart(data, x, mean, stdDev);
	}
}

function distribusiNormal(x, mean, stdDev) {
	var exponent = -((x - mean) ** 2) / (2 * stdDev ** 2);
	var penyebut = stdDev * Math.sqrt(2 * Math.PI);
	return Math.exp(exponent) / penyebut;
}

function drawChart(data, x, mean, stdDev) {
	var options = {
		title: "Distribusi Normal",
		hAxis: {
			title: "X",
		},
		vAxis: {
			title: "Probabilitas",
		},
		legend: "none",
	};

	var chart = new google.visualization.LineChart(
		document.getElementById("chart")
	);

	google.visualization.events.addListener(chart, "ready", function () {
		chart.setSelection([{ row: getRowIndex(x, mean, stdDev), column: 1 }]);
	});

	chart.draw(data, options);

	var zScore = (x - mean) / stdDev;
	var cumulativeProbability = cumulativeDistribusiNormal(zScore);

	var result = document.getElementById("result");
	result.innerHTML = "";

	var pLebihDariX = document.createElement("p");
	pLebihDariX.innerText = `P(X > ${x}) = ${(1 - cumulativeProbability).toFixed(
		4
	)}`;
	result.appendChild(pLebihDariX);

	var pKurangDariSamaDenganX = document.createElement("p");
	pKurangDariSamaDenganX.innerText = `P(X ≤ ${x}) =  ${cumulativeProbability.toFixed(
		4
	)}`;
	result.appendChild(pKurangDariSamaDenganX);

	var pZScore = document.createElement("p");
	pZScore.innerText = "Z-Score: " + zScore.toFixed(2);
	result.appendChild(pZScore);
}

function cumulativeDistribusiNormal(z) {
	var t = 1 / (1 + 0.2316419 * Math.abs(z));
	var d = 0.3989423 * Math.exp((-z * z) / 2);
	var cumulativeProbability =
		d *
		t *
		(0.3193815 +
			t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

	if (z > 0) {
		cumulativeProbability = 1 - cumulativeProbability;
	}

	return cumulativeProbability;
}

function getRowIndex(x, mean, stdDev) {
	return Math.round((x - mean + 3 * stdDev) / 0.1);
}
