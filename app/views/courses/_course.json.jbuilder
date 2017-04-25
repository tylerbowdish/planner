# json.extract! course, :number, :name, :description, :credits
#json.url course_url(course, format: :json)

json.set! course.number do
	json.id course.number
	json.name course.name
	json.description course.description
	json.credits course.credits
end