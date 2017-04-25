class PlansController < ApplicationController
  before_action :set_plan, only: [:show, :edit, :update, :destroy]
  before_filter :authenticate_user!
  # GET /plans
  # GET /plans.json
  def index
    if current_user.role == "Student"
      @plans = Plan.where(user_id: current_user.id)
    elsif current_user.role == "Faculty"
      @plans = Plan.all
    elsif current_user.role == "Admin"
      @plans = Plan.all
    end
  end

  # GET /plans/1
  # GET /plans/1.json
  def show
    @plan = Plan.find_by_id(params[:id])
    @id = @plan.id
    @user = User.find_by_id(@plan.user_id)
  end

  # GET /plans/new
  def new
    @plan = Plan.new
  end

  # GET /plans/1/edit
  def edit
  end

  # POST /plans
  # POST /plans.json
  def create
    @plan = Plan.new(plan_params)
    @plan.user_id = current_user.id

    respond_to do |format|
      if @plan.save
        term = Term.create(plan_id: @plan.id, semester: @plan.currTerm, year: @plan.currYear)
        termCourse = TermCourse.create(term_id: term.id, course_id: Course.find_by(number: "ORNT_3001").id)
        format.html { redirect_to @plan, notice: 'Plan was successfully created.' }
        format.json { render :show, status: :created, location: @plan }
      else
        format.html { render :new }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /plans/1
  # PATCH/PUT /plans/1.json
  def update
    respond_to do |format|
      if @plan.update(plan_params)
        format.html { redirect_to @plan, notice: 'Plan was successfully updated.' }
        format.json { render :show, status: :ok, location: @plan }
      else
        format.html { render :edit }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /plans/1
  # DELETE /plans/1.json
  def destroy
    @plan.destroy
    respond_to do |format|
      format.html { redirect_to plans_url, notice: 'Plan was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_plan
      @plan = Plan.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def plan_params
      params.require(:plan).permit(:name, :user_id, :currTerm, :currYear, :catalogYear)
    end
end
