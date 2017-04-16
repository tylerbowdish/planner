#json.extract! plan, :id, :name, :created_at, :updated_at
#json.url plan_url(plan, format: :json)

json.set! :student, User.find(plan.user_id).login 
json.set! :planName, plan.name
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
			json.set! thisCourse.number do
				json.(thisCourse, :number, :name)
				json.(term, :year)
				json.set! :term, term.semester
				json.(:term)
				json.(thisCourse, :credits)
			end
		end
	end
end