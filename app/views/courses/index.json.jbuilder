json.courses do
	@courses.each{ |course|
		json.partial! 'courses/course', course: course
	}
end