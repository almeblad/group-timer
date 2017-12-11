;(function(exports) {

	function Timer() {
		this.endTime = new Date().getTime();
	}

	Timer.prototype = {

		setEndTime: function(time) {
			this.endTime = new Date().getTime() + time;
		},
		setEndTimeFromServer: function(time) {
			this.endTime = time;
			this.timeRemaining();
		},
		timeRemaining: function() {
			this.timeLeft = this.endTime - new Date().getTime();
		},
		format: function() {
			var time = this.timeLeft,
				seconds = Math.floor((time / 1000) % 60),
				minutes = Math.floor((time / (1000 * 60)) % 60),
				hours = Math.floor((time / (1000 * 60 * 60)) % 24);

			if (time < 0) {
				return "00:00";
			} 

			var formattedTime = "";
			if (hours > 0 && hours < 10) {
				formattedTime += "0" + hours + ":";
			} else if (hours >= 10) {
				formattedTime += hours + ":";
			}

			if (minutes < 10) {
				formattedTime += "0" + minutes + ":";
			} else {
				formattedTime += minutes + ":";
			}

			if (seconds < 10) {
				formattedTime += "0" + seconds;
			} else {
				formattedTime += seconds;
			}

			return formattedTime;
		}
	};

	exports.Timer = Timer;

})(typeof exports === 'undefined' ? this : exports);

;(function() {

	var timer = new Timer(),
		socket = io.connect('http://localhost:3000');
	
	socket.on('currentEndTime', function (data) {
		//this is the full date time in ms.
		timer.setEndTimeFromServer(data.time);
	});

	$(function () {
		$('#set-timer').on('click', function (e) {
			e.stopPropagation();
			var time = $('#time-input').val() * 1000;
			console.log("time" + time);
			timer.setEndTime(time);
			timer.timeRemaining();
			socket.emit('setTimer', { time: time });
		});
	});

	setInterval(function() {
		if (timer.timeLeft > 0) {
			timer.timeRemaining();
			$('#timer').text(timer.format());
		}
	},100);

})();