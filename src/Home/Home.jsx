import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ADD THIS IMPORT

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    comment: "",
    type: "comment",
  });
  const [activeTab, setActiveTab] = useState("about");
  const [feedbackLoading, setFeedbackLoading] = useState(false); // ADD THIS
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // ADD THIS

  // Sample slides data
  const slides = [
    {
      id: 1,
      image:
        "https://i.ibb.co.com/LzhmhYmk/472098526-122182541246054973-4624950372467519375-n.jpg",
      title: "Welcome to CUSAP",
      description: "Chittagong University Students Association of Pekua",
    },
    {
      id: 2,
      image:
        "https://i.ibb.co.com/zhvyD0xk/471780972-122182121474054973-4391574690028891321-n.jpg",
      title: "Student Development",
      description:
        "Empowering students through various programs and initiatives",
    },
    {
      id: 3,
      image:
        "https://i.ibb.co.com/35GpxcCV/496307778-122198842970054973-5902264986160171843-n.jpg",
      title: "Community Engagement",
      description:
        "Building strong connections within the university community",
    },
  ];

  // Sample committee members
  const committeeMembers = [
    {
      id: 1,
      name: "Delowar Hossain",
      position: "President",
      image: "https://i.ibb.co.com/SDB94qxS/delowar.jpg",
      speech:
        "As President, I warmly welcome all members and well-wishers of CUSAP. Together, we aim to create a strong platform for unity, leadership, and service among the students of Pekua at the University of Chittagong.",
    },
    {
      id: 2,
      name: "Mohammad Kaisar",
      position: "General Secretary",
      image: "https://i.ibb.co.com/1YKfnS6N/kaisar.png",
      speech:
        "As General Secretary, I believe in teamwork and dedication. Our mission is to strengthen the bond among students and organize impactful programs for academic and personal growth.",
    },
  ];

  // Sample events
  const upcomingEvents = [
    {
      id: 1,
      title: "Publish Full Panel of CUSAP",
      date: "2025-11-11",
      time: "2:00 PM - 4:00 PM",
      location: "Facebook Page",
      link: "www.facebook.com/profile.php?id=61551649208728",
    },
    {
      id: 2,
      title: "Publish CUSAP plan of comittee",
      date: "2025-11-20",
      time: "10:00 AM - 12:00 PM",
      location: "Committee Room A",
      link: "www.facebook.com/profile.php?id=61551649208728",
    },
    {
      id: 3,
      title: "Publish CUSAP Website",
      date: "2025-12-02",
      time: "3:00 PM - 5:00 PM",
      location: "Student Center",
      link: "www.facebook.com/profile.php?id=61551649208728",
    },
  ];

  // Auto slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Fetch all feedback when admin tab is active
  useEffect(() => {
    if (activeTab === "admin-feedback" && isAdmin()) {
      fetchAllFeedback();
    }
  }, [activeTab, isAdmin]);

  const fetchAllFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const response = await fetch('https://university-association-backend-1.onrender.com/comment');
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.name && newComment.comment) {
      const commentToAdd = {
        ...newComment,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        status: "pending",
      };

      // ✅ Send to database
      fetch("https://university-association-backend-1.onrender.com/comment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(commentToAdd),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Saved to DB:", data);
          if (data.insertedId) {
            alert("Thank you! Your comment has been submitted successfully.");
          }
        })
        .catch((err) => console.error("Error saving comment:", err));

      // Reset UI instantly (optional)
      setComments([commentToAdd, ...comments]);
      setNewComment({
        name: "",
        email: "",
        mobile: "",
        comment: "",
        type: "comment",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to delete feedback (admin only)
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      const response = await fetch(`https://university-association-backend-1.onrender.com/comment/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setComments(comments.filter(comment => comment._id !== id));
        alert('Feedback deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Error deleting feedback!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4"></div>
          </div>
        </div>
      </header>

      {/* Hero Slider Section */}
      <section className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 text-white drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white drop-shadow-md max-w-2xl mx-auto">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 sm:p-2 transition-all"
          aria-label="Previous slide"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 sm:p-2 transition-all"
          aria-label="Next slide"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-2 lg:px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              About CUSAP
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <p className="text-lg text-gray-700 text-justify leading-relaxed mb-6">
                Chittagong University Students' Association of Pekua (CUSAP) is
                a student-led organization formed by the students of Pekua
                studying at the University of Chittagong. The association works
                to create unity among students, provide academic and social
                support, and strengthen the bond between university life and
                community service.
                <br></br>
                CUSAP regularly organizes various initiatives such as
                educational seminars, cultural programs, social welfare
                activities, and guidance sessions for university admission
                seekers from Pekua. Through teamwork, leadership, and
                dedication, CUSAP aims to build a strong, cooperative network of
                students who contribute positively to both campus life and
                society.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Student Welfare
                  </h3>
                  <p className="text-sm text-gray-600">
                    Supports students of Pekua studying at the University of
                    Chittagong through guidance and cooperation.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Community Building
                  </h3>
                  <p className="text-sm text-gray-600">
                    Strengthens the bond among members to create a united and
                    active student network.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Social Engagement
                  </h3>
                  <p className="text-sm text-gray-600">
                    Organizes educational, cultural, and welfare activities for
                    positive social impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* Join With Us Button after About Section */}
<div className="text-center py-8 bg-white">
  <button
    onClick={() => navigate('/addMember')}
    className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-xl hover:bg-blue-600 hover:scale-110 transition-all font-medium"
  >
    Join With CUSAP
  </button>
</div>
      {/* Committee Members Section */}
      <section id="committee" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Committee
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Meet the leading faces of CUSAP working to build a stronger
              university community.
            </p>
          </div>

          {/* Members */}
          <div className="grid md:grid-cols-2 gap-8">
            {committeeMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-40 h-40 mx-auto rounded-full object-cover mb-6 border-4 border-blue-500"
                />
                <h3 className="text-2xl font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-4">
                  {member.position}
                </p>
                <p className="text-gray-700 text-justify leading-relaxed">
                  {member.speech}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* See Executive Committee Button after Committee Section */}
<div className="text-center py-8 bg-gray-50">
  <button
    onClick={() => navigate('/committee')}
    className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-xl hover:bg-blue-600 hover:scale-110 transition-all font-medium"
  >
    See Executive Committee
  </button>
</div>
      {/* Events Section */}
      <section id="events" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Upcoming Events
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-3 text-center min-w-16">
                      <div className="font-bold text-lg">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs uppercase">
                        {new Date(event.date).toLocaleString("default", {
                          month: "short",
                        })}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {event.time} • {event.location}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://${event.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Details
                    </button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comments & Objections Section */}
      <section id="feedback" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Share Your Feedback
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We value your input. Share your comments, suggestions, or concerns
              with the committee.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap ${
                      activeTab === "about"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    About Feedback
                  </button>
                  <button
                    onClick={() => setActiveTab("form")}
                    className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap ${
                      activeTab === "form"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Submit Feedback
                  </button>
                  {/* Admin Feedback Tab - Only show for admins */}
                  {isAdmin() && (
                    <button
                      onClick={() => setActiveTab("admin-feedback")}
                      className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap ${
                        activeTab === "admin-feedback"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      All Feedback ({comments.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "about" && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Feedback Guidelines
                    </h3>
                    <div className="space-y-4 text-gray-700">
                      <p>
                        The CUSAP committee welcomes constructive feedback from
                        students, faculty, and staff to help us improve our
                        services and initiatives.
                      </p>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <p className="font-medium text-yellow-800">
                          Please Note:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-yellow-700 space-y-1">
                          <li>All submissions are reviewed by the committee</li>
                          <li>We aim to respond within 3-5 working days</li>
                          <li>
                            Please provide specific and actionable feedback
                          </li>
                          <li>
                            Respectful and professional language is required
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "form" && (
                  <form onSubmit={handleCommentSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newComment.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="mobile"
                          name="mobile"
                          value={newComment.mobile}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your phone Number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="comment"
                        value={newComment.comment}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Please share your feedback, comments, or concerns..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Submit Feedback
                    </button>
                  </form>
                )}

                {/* Admin Feedback Tab Content */}
                {activeTab === "admin-feedback" && isAdmin() && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">All Feedback Submissions</h3>
                      <button
                        onClick={fetchAllFeedback}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </button>
                    </div>

                    {feedbackLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading feedback...</p>
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <svg
                          className="w-16 h-16 mx-auto text-gray-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        <p>No feedback submissions yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {comments.map((comment) => (
                          <div
                            key={comment._id}
                            className="border border-gray-200 rounded-lg p-4 relative"
                          >
                            {/* Delete button for admin */}
                            <button
                              onClick={() => handleDeleteFeedback(comment._id)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                              title="Delete Feedback"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>

                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-semibold text-gray-800">
                                  {comment.name}
                                </span>
                                {comment.mobile && (
                                  <span className="ml-2 text-sm text-gray-500">
                                    📞 {comment.mobile}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
                                {comment.date}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{comment.comment}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span>
                                Type: <span className="font-medium capitalize">{comment.type}</span>
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                comment.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : comment.status === 'resolved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {comment.status || 'pending'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;