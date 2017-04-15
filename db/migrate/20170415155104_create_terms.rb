class CreateTerms < ActiveRecord::Migration[5.0]
  def change
    create_table :terms do |t|
      t.references :plan, foreign_key: true
      t.string :semester
      t.integer :year

      t.timestamps
    end
  end
end
