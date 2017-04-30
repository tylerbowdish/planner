/**
 * A class representing a course
 */
class Course {
	/**
	 * The contstructor setting up the initial values for a course
	 * @param  {string} name - The name/title of a course (eg. Web Applications)
	 * @param  {float} credits - The number of credits a course counts for
	 */
	constructor(name, credits) {
		this.name = name;
		this.credits = credits;
	}
}

/**
 * @param  {Course} course - The course object to be drawn
 */
function drawCourse(id, name, credits, term, year) {
	if ($('#ur .' + term + '.' + year + ' .courses .' + id).length == 0) {
		$('#ur .' + term + '.' + year + ' .courses').append('<li class="course ' + id + '" data-id="' + id + '">' + id + ' ' + name + '<span class="credits">' +  credits + '</span></li>');
	}
}

/**
 * @param  {string} id - The id of the course
 * @param  {string} term - The term (short version) in which the course resides (eg. fa, sp, su)
 * @param  {integer} year - The year in which the course resides
 */
function undrawCourse(id, term, year) {
	$('#ur').find('.' + term + '.' + year + ' .' + id).remove();
}

/**
 * A class representing a term
 */
class Term {
	/**
	 * The constructor setting up the initial values for a term
	 */
	constructor() {
		this.courses = {};
		this.credits = 0.0;
	}
}

/**
 * A class representing a year
 */
class Year {
	/**
	 * The constructor setting up the initial values for a year
	 * @param  {integer} - The value which identifies which year this Year is
	 * @param  {boolean} - Whether this year is before the current year
	 */
	constructor(year, past) {
		this.year = year;
		this.past = past;
		this.terms = {
			'fa': new Term(),
			'sp': new Term(),
			'su': new Term()
		}
	}
}

/**
 * @param  {Year} year - The year object to be drawn
 */
function drawYear(year) {
	var past = year.past;
	var terms = year.terms;

	// Loop through each term - printing out each one
	for (var term in terms) {
		var courses = terms[term].courses;
		var credits = terms[term].credits;

		// Check if we need to add a "past" class
		past = past ? ' past' : '';
		var yearNum = term == 'fa' ? year.year : year.year + 1;

		var html = '\
				<div class="semester' + past + ' ' + term + ' ' + year.year + '" data-term="' + term + '" data-year="' + year.year + '">\
					<h2>' + convertTerms(term, 'long') + ' ' + yearNum + '</h2>\
					<div class="credits">Hours: <span>' + credits + '</span></div>\
					<ul class="courses">\
					</ul>\
				</div>';

		// Go ahead and output the constructed html
		$('#ur').append(html);

		for(var id in courses) {
			var course = courses[id];
			drawCourse(id, course.name, course.credits, term, year.year);
		}
	}
}

/**
 * @param  {integer} year - The year number to be removed
 */
function undrawYear(year) {
	$('#ur .' + year).remove();
}

/**
 * A class representing a catalog
 */
class Catalog {
	/**
	 * @param  {integer} year - The year of the catalog
	 * @param  {object} courses - An object containing all the possible courses
	 */
	constructor(year, courses) {
		this.year = year ? year : null;
		this.courses = courses ? courses : {};
	}

	/**
	 * @param {object} data - JSON object data which contains the year and courses for a catalog
	 */
	setData(data) {
		//FIX
		//this.year = 2016;
		this.courses = data.courses;
	}

	/**
	 * @param {string} id - The id of the course
	 * @param {string} name - The name/title of the course (eg. Web Applications)
	 * @param {float} credits - The number of credits a course counts for
	 */
	addCourse(id, name, credits) {
		this.courses[id] = new Course(name, credits);
	}
}

/**
 * A class representing a plan
 */
class Plan {
	/**
	 * @param  {string} name - The name of the plan currently being edited
	 * @param  {integer} catYear - The year of the catalog being used in the plan
	 * @param  {string} major - The major of the student to which this plan belongs
	 * @param  {string} student - The name of the student to which this plan belongs
	 * @param  {integer} currYear - The current year in which this plan is being used
	 * @param  {string} currTerm - The current term in which this term is being used
	 */
	constructor(name, catYear, major, student, currYear, currTerm) {
		this.years = {};
		this.catalog = {};
		this.name = name;
		this.catYear = catYear;
		this.major = major;
		this.student = student;
		this.currYear = currYear;
		this.currTerm = convertTerms(currTerm, 'short');
	}

	/**
	 * @param {object} data - JSON object containing all the necessary information for a plan
	 * @param {Catalog} catalog - The catalog which to use when adding courses
	 */
	setData(data, catalog) {
		this.catalog = catalog;
		this.name = data.planName;
		this.catYear = data.catalogYear;
		this.major = data.major;
		this.student = data.student;
		this.currYear = data.currYear;
		this.currTerm = convertTerms(data.currTerm, 'short');

		for (var course in data.courses) {
			course = data.courses[course];
			this.addCourse(course.id, course.term, course.year);
		}

		drawPlan(this);
	}

	/**
	 * @param {Catalog} catalog - The current catalog to be used by this plan
	 */
	setCatalog(catalog) {
		this.catalog = catalog;
	}

	/**
	 * @param {string} id - 
	 * @param {string} term - 
	 * @param {integer} year - 
	 */
	addCourse(id, term, year, draw) {
		term = convertTerms(term, 'short');
		draw = draw !== undefined ? draw : false;
		if (this.catalog.courses[id] == undefined) {
			customAlert('Cannot add course: ' + id + ', it does not exist in the catalog!');
			return;
		} else if (this.years[year] == undefined) {
			this.addYear(year);
		}

		this.years[year].terms[term].courses[id] = this.catalog.courses[id];
		this.years[year].terms[term].credits += this.catalog.courses[id].credits;

		if(draw) {
			drawCourse(id, this.catalog.courses[id].name, this.catalog.courses[id].credits, term, year);
			drawCredits(term, year, this.years[year].terms[term].credits);
		}
	}

	/**
	 * @param  {string} id - 
	 * @param  {string} term - 
	 * @param  {integer} year - 
	 */
	removeCourse(id, term, year) {
		term = convertTerms(term, 'short');
		if (this.years[year].terms[term].courses[id] == undefined) {
			customAlert('Cannot delete "' + id + '", it does not exist!');
			return;
		}

		var credits = this.years[year].terms[term].courses[id].credits;
		this.years[year].terms[term].credits -= credits;

		undrawCourse(id, term, year);
		delete this.years[year].terms[term].courses[id];

		drawCredits(term, year, this.years[year].terms[term].credits);
	}

	/**
	 * @param {integer} year - 
	 */
	addYear(year) {
		if (this.years[year] !== undefined) {
			customAlert('Cannot add year "' + year + '", it already exists!');
			return;
		}

		var past = year < this.currYear ? true : false;
		this.years[year] = new Year(year, past);
	}

	/**
	 * @param  {integer} year - 
	 */
	removeYear(year) {
		if (this.years[year] == undefined) {
			customAlert('Cannot delete "' + year + '", it does not exist!');
			return;
		}

		undrawYear(year);
		delete this.years[year];
	}

	/**
	 * @param  {string} id - 
	 * @param  {string} oldTerm - 
	 * @param  {integer} oldYear - 
	 * @param  {string} newTerm - 
	 * @param  {integer} newYear - 
	 */
	updateCourse(id, oldTerm, oldYear, newTerm, newYear) {
		oldTerm = convertTerms(oldTerm, 'short');
		newTerm = convertTerms(newTerm, 'short');
		var course = this.years[oldYear].terms[oldTerm].courses[id];

		if (this.years[oldYear] == undefined || this.years[oldYear].terms[oldTerm] == undefined || course == undefined) {
			customAlert('Cannot move course: ' + id + ' from ' + oldTerm.toUpperCase() + oldYear + ', the course does not exist!');
			return;
		}

		if (newTerm !== '' && newYear !== '') {
			this.addCourse(id, newTerm, newYear);
			drawCredits(newTerm, newYear, this.years[newYear].terms[newTerm].credits);
		}

		this.removeCourse(id, oldTerm, oldYear);
	}
}

function drawPlan(currPlan) {
	for(var year in currPlan.years) {
		drawYear(currPlan.years[year]);
	}
}

/**
 * @param  {string} term - 
 * @param  {string} type - 
 */
function convertTerms(term, type) {
	if(term == undefined) {
		return undefined;
	}

	var shortToLong = {
		'fa': 'Fall',
		'sp': 'Spring',
		'su': 'Summer'
	}

	var longToShort = {
		'fall': 'fa',
		'spring': 'sp',
		'summer': 'su'
	}

	term = term.toLowerCase();
	type = type.toLowerCase();

	if (shortToLong[term] !== undefined && type == 'long') {
		return shortToLong[term];
	} else if (longToShort[term] !== undefined && type == 'short') {
		return longToShort[term];
	}
	return term;
}

/**
 * @param  {Plan} plan - 
 * @param  {string} term - 
 * @param  {integer} year - 
 */
function drawCredits(term, year, credits) {
	term = convertTerms(term, 'short');
	$('#ur .' + term + '.' + year + ' .credits span').html(credits);
}

/**
 * @param  {Plan} currPlan - 
 */
function setupDragNDrop(currPlan) {
	$('.semester:not(.past) .courses, #delete, #courselisttab').sortable({
		connectWith: '.semester:not(.past) .courses, #delete',
		tolerance: 'pointer',
		// containment: '.container, .br',
		delay: 0,
		zIndex: 999,
		stop: function(e, ui) {
			// Get the id of the course just moved
			var id = $(ui['item']).data('id');

			// If we are dragging from a semester
			if($(e.target).parents('.semester').length > 0) {
				// Get the current term and year that the course is in
				var oldTerm = $(e.target).parents('.semester').data('term');
				var oldYear = $(e.target).parents('.semester').data('year');

				// If the course is being dropped on the delete zone
				if ($(ui['item']).parents('#delete').length > 0) {
					// Remove the course from the term and year
					currPlan.removeCourse(id, oldTerm, oldYear);

					// Do a fancy transition
					$('#delete li').hide('slide', {
						direction: 'right'
					}, 500, function() {
						// Remove the course from the delete zone
						$('#delete li').remove();
						$('#delete-wrap').hide();
					});
				// If the course is being dropped on a different semester (ie. it is being moved)
				} else if (!$(e.target).parents('.semester').is($(ui['item']).parents('.semester'))) {
					// Get the new location information
					var newTerm = $(ui['item']).parents('.semester').data('term');
					var newYear = $(ui['item']).parents('.semester').data('year');

					// Move the course
					currPlan.updateCourse(id, oldTerm, oldYear, newTerm, newYear);
				}
			// If we are dragging from the catalog
			} else if($(e.target).parents('table').length > 0 && $(ui['item']).parents('.semester').length > 0) {
				// Get the new location information
				var term = $(ui['item']).parents('.semester').data('term');
				var year = $(ui['item']).parents('.semester').data('year');

				// Add the course
				currPlan.addCourse(id, term, year, true);

				// Don't remove it from the catalog
				return false;
			}

			// If we are not dropping on the delete zone
			if($('#delete-wrap li').length == 0) {
				// Hide the delete zone
				$('#delete-wrap').hide();
			}
		},
		helper: function(e, item) {
			// Add the helper class early so that the css gets applied (changed the width)
			item.addClass('ui-sortable-helper');

			// Change where the item is in relation to the cursor (centered)
			$(this).sortable('option', 'cursorAt', {
					left: Math.floor(item.width() / 2),
					top: Math.floor(item.height() / 2)
			});

			// Give the item as the helper (not clone)
			return item;
		},
		start: function(e, ui) {
			// If we are not draging from the catalog
			if($(e.target).parents('table').length == 0) {
				// Show the delete zone
				$('#delete-wrap').show();

				// We just displayed the delete zone so we need to make sure the sortable sees it
				$(this).sortable('refresh');
			}

			// Get the parent that can scroll
			var scrollParent = $(this).data('ui-sortable').scrollParent;

			// Find the height that we can scroll
			var maxScrollTop = scrollParent[0].scrollHeight - scrollParent.height() - ui.helper.height() + 25;

			// Store the height
			$(this).data('maxScrollTop', maxScrollTop);
		},
		sort: function (e, ui) {
			// Get the parent that can scroll
			var scrollParent = $(this).data("ui-sortable").scrollParent,

			// Get the height that we can scroll
			maxScrollTop = $(this).data('maxScrollTop');

			// If we are trying to scroll past the allowed height
			if(scrollParent.scrollTop() > maxScrollTop){
				// Scroll back to the max height we can scroll
				scrollParent.scrollTop(maxScrollTop);
			}
		}
	}).disableSelection();
}

/**
 * @param  {Plan} currPlan - 
 */
function setupButtons(currPlan) {
	$('#delete-year').on('click', function(e) {
		e.preventDefault();

		if ($('.semester:not(.past)').length == 0) {
			customAlert('There are no current years to delete!');
			return;
		}

		var year = $('.semester:not(.past)').last().data('year');
		currPlan.removeYear(year);
	});

	$('#add-year').on('click', function(e) {
		e.preventDefault();

		var year = $('.semester').last().data('year');
		if(year == undefined) {
			year = currPlan.currYear + 1;
		}

		currPlan.addYear(year + 1);
		drawYear(currPlan.years[year + 1]);
		setupDragNDrop(currPlan);
	});
}

/**
 * @param  {string} text - 
 */
function customAlert(text) {
	var n = noty({
		layout: 'topRight',
		theme: 'metroui',
		text: text,
		type: 'warning',
		timeout: 3000,
		progressBar: true
	});
}

function fillPlan(planId) {
	var catalog = new Catalog();
	currPlan = new Plan();

	$.getJSON('/courses.json', function(data) {
		catalog.setData(data);
		console.log(data.courses);
		for (var i in data.courses) {
			var newRow = document.createElement("tr");
			$(newRow).attr('data-id', i);
			for (var j in data.courses[i]) {
				var newCol = document.createElement("td");
				var txt = document.createTextNode(data.courses[i][j]);
				newCol.appendChild(txt);
				newRow.appendChild(newCol);
			}
			$('#courselisttab').append(newRow);
		}

		$.getJSON('/plans/' + planId + '.json', function(data) {
			currPlan.setData(data, catalog);

			console.log(catalog);
			console.log(currPlan);

			setupDragNDrop(currPlan);
			setupButtons(currPlan);
		});
	});

	// My Version
	// var catalog = new Catalog(),
	// currPlan = new Plan();
	// $.getJSON('/~weaver/TermProject/data.php?getCourseList=1', function(data) {
	//     catalog.setData(data);

	//     $.getJSON('/~weaver/TermProject/data.php?getPlan=1', function(data) {
	//         currPlan.setData(data, catalog);

	//         console.log(catalog);
	//         console.log(currPlan);

	//         setupDragNDrop(currPlan);
	//         setupButtons(currPlan);

	//     });
	// });

	// Combined Version
	// var catalog = new Catalog(),
	// currPlan = new Plan();
	// $.getJSON('/~gallaghd/cs3220/termProject/getCombined.php', function(data) {
	//  catalog.setData(data.catalog);
	//  currPlan.setData(data.plan, catalog);

	//  console.log(catalog);
	//  console.log(currPlan);

	//  setupDragNDrop(currPlan);
	//  setupButtons(currPlan);
	// });
}


//since I'm not using flex boxes, resize the divs whenever the window is resized
function resetGrid() {
	// var width = window.innerWidth;
	// var height = window.innerHeight;
	// document.getElementsByClassName('container')[0].style.width = window.innerWidth * .75 + "px";
	// document.getElementsByClassName('container')[0].style.height = (window.innerHeight - 40) * .60 + "px";
	// document.getElementsByClassName('br')[0].style.width = window.innerWidth * .75 + "px";
	// document.getElementsByClassName('br')[0].style.height = (window.innerHeight - 40) * .34 + "px";
	// document.getElementsByClassName('ul')[0].style.width = window.innerWidth * .24 + "px";
	// document.getElementsByClassName('ul')[0].style.height = (window.innerHeight - 40) * .60 + "px";
	// document.getElementsByClassName('bl')[0].style.width = window.innerWidth * .24 + "px";
	// document.getElementsByClassName('bl')[0].style.height = (window.innerHeight - 40) * .34 + "px";
}

$(document).ready(function(){

$('#save_plan').on('click', function(){
    customAlert("Saving plan...")
     $.ajax({
      type: "POST",
      url: "/plans/save",
      data: { id: $("#save_plan").data('planid'),
              years: JSON.stringify(currPlan.years)
            },
      success:
        function(){customAlert("Plan saved successfully.");},
      error:
        function(){customAlert("Could not save plan.")},
    });
});
});