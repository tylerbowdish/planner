class CreateTermCourses < ActiveRecord::Migration[5.0]
  def change
    create_table :term_courses do |t|
      t.references :term, foreign_key: true
      t.references :course, foreign_key: true

      t.timestamps
    end
  end
end
