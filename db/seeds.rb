# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
user1 = User.new
user1.login = "joe"
user1.email = "joe@cedarville.edu"
user1.password = "password"
user1.password_confirmation = "password"
user1.major = "Computer Science"
user1.role = "Student"
user1.save!

user2 = User.new
user2.login = "pete"
user2.email = "pete@cedarville.edu"
user2.password = "password"
user2.password_confirmation = "password"
user2.major = "Computer Engineering"
user2.role = "Student"
user2.save!

user3 = User.new
user3.login = "admin"
user3.email = "admin@cedarville.edu"
user3.password = "admin1"
user3.password_confirmation = "admin1"
user3.role = "Admin"
user3.save!

user4 = User.new
user4.login = "gallagher"
user4.email = "gallagher@cedarville.edu"
user4.password = "password"
user4.password_confirmation = "password"
user4.major = "Computer Science"
user4.role = "Faculty"
user4.save!

#give joe a couple of plans
plan1 = Plan.new
plan1.name = "my plan"
plan1.user_id = user2.id
plan1.catalogYear = 2014
plan1.currYear = 2015
plan1.currTerm = "Spring"
plan1.save!

Plan.create(user_id: user1.id, name: "Plan1", catalogYear: 2014, currYear: 2015, currTerm: "Spring")
Plan.create(user_id: user1.id, name: "Plan2", catalogYear: 2014, currYear: 2016, currTerm: "Spring")

Course.create(number: "ORNT-3001", name: "Getting Started in Moodle", description: "Some class that no one takes, but is required for everyone.", credits: 0)

course1 = Course.new
course1.number = "1234"
course1.name = "newcourse"
course1.description = "blah blah blah"
course1.credits = 5
course1.save!

course2 = Course.create(number: "CS-1210", name: "C++ Programming", description: "This course is SO easy!", credits: 2)
course3 = Course.create(number: "AB-1234", name: "Test course", description: "Arbitrary description", credits: 3)
course4 = Course.create(number: "CS-2234", name: "Computers", description: "Learn about computers", credits: 3)
course5 = Course.create(number: "HIST-1000", name: "Biography of Dr. G", description: "The most important history class you'll ever take", credits: 7)
course6 = Course.create(number: "CS-3360", name: "Databases", description: "' OR 1 = 1; DROP TABLE 'courses' --", credits: 3)
course7 = Course.create(number: "CS-1220", name: "Object-oriented design", description: "A fun class until you get to the final project", credits: 3)
course8 = Course.create(number: "BTGE-1000", name: "Spiritual Formation", description: "Spifo", credits: 3)
course9 = Course.create(number: "PE-101", name: "PACL", description: "run run run run run run run", credits: 3)

term1 = Term.create(plan_id: plan1.id, semester: "Fall", year: 2014)
term2 = Term.create(plan_id: plan1.id, semester: "Spring", year: 2015)
term3 = Term.create(plan_id: plan1.id, semester: "Summer", year: 2015)
term4 = Term.create(plan_id: plan1.id, semester: "Fall", year: 2015)
term5 = Term.create(plan_id: plan1.id, semester: "Spring", year: 2016)
term6 = Term.create(plan_id: plan1.id, semester: "Summer", year: 2016)

TermCourse.create(term_id: term1.id, course_id: course1.id);
TermCourse.create(term_id: term1.id, course_id: course2.id);
TermCourse.create(term_id: term2.id, course_id: course3.id);

TermCourse.create(term_id: term4.id, course_id: course4.id);
TermCourse.create(term_id: term4.id, course_id: course5.id);
TermCourse.create(term_id: term5.id, course_id: course6.id);
TermCourse.create(term_id: term5.id, course_id: course7.id);
TermCourse.create(term_id: term6.id, course_id: course8.id);
TermCourse.create(term_id: term6.id, course_id: course9.id);