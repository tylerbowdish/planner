#json.extract! plan, :id, :name, :created_at, :updated_at
#json.url plan_url(plan, format: :json)

json.set! :student, User.find(plan.user_id).login 
json.set! :name, plan.name
json.set! :major, User.find(plan.user_id).major
json.(:student)
json.(:planName)
json.(:major)
json.(plan, :catalogYear, :currYear, :currTerm)
json.set! :courses do
	terms = Term.where(plan_id: plan.id)
	terms.each do |term|
		termcourses = TermCourse.where(term_id: term.id)
		termcourses.each do |term_course|
			thisCourse = Course.find(term_course.course_id)
			json.set! term_course.id do
				json.id thisCourse.number
				json.(thisCourse, :name)
				json.(term, :year)
				json.term term.semester
				json.(thisCourse, :credits)
			end
		end
	end
end