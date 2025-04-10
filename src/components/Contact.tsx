import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section className="py-24 bg-[#0A192F]" id="contact">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#64FFDA] font-mono mb-4">03. What's Next?</p>
          <h2 className="text-[#CCD6F6] text-4xl lg:text-5xl font-bold mb-6">Get In Touch</h2>
          <p className="text-[#8892B0] mb-12 text-lg">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, 
            I'll try my best to get back to you!
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:your.email@example.com"
            className="inline-block px-8 py-4 border-2 border-[#64FFDA] text-[#64FFDA] rounded hover:bg-[#64FFDA]/10 transition-colors font-mono"
          >
            Say Hello
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;