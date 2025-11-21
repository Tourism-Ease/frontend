import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function ContactFormCard() {
    return (
        <div className="flex flex-col gap-6 rounded-xl border-0 shadow-md">
            <div className="px-6 pt-6">
                <h4 className="flex items-center gap-2 text-lg font-medium">
                    <FontAwesomeIcon icon={faPaperPlane} className="text-blue-500" />
                    Send Us a Message
                </h4>
                <p className="text-gray-500">
                    Fill out the form below and we'll get back to you as soon as possible
                </p>
            </div>

            <div className="px-6 pb-6">
                <form className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Your Name"
                            required
                            className="placeholder:text-gray-500 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            required
                            className="placeholder:text-gray-500 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium">
                            Message
                        </label>
                        <textarea
                            id="message"
                            placeholder="Tell us how we can help you..."
                            rows={4}
                            required
                            className="resize-none placeholder:text-gray-500 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="text-white bg-linear-to-r from-cyan-500 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} className="me-1" />
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
