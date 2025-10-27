import os
from datetime import datetime
from fpdf import FPDF

class CertificateService:
    def __init__(self, output_dir="certificates"):
        self.output_dir = output_dir
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def generate_certificate(self, participant_name, quiz_title, score, date=None):
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")

        pdf = FPDF('L', 'mm', 'A4')
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 32)
        pdf.cell(0, 20, "Certificate of Achievement", align='C', ln=True)
        pdf.ln(10)
        pdf.set_font("Helvetica", "", 20)
        pdf.cell(0, 10, f"This is to certify that", align='C', ln=True)
        pdf.ln(10)
        pdf.set_font("Helvetica", "B", 24)
        pdf.cell(0, 10, f"{participant_name}", align='C', ln=True)
        pdf.ln(10)
        pdf.set_font("Helvetica", "", 18)
        pdf.cell(0, 10, f"has successfully completed the quiz:", align='C', ln=True)
        pdf.ln(5)
        pdf.set_font("Helvetica", "B", 20)
        pdf.cell(0, 10, f"\"{quiz_title}\"", align='C', ln=True)
        pdf.ln(10)
        pdf.set_font("Helvetica", "", 16)
        pdf.cell(0, 10, f"with a score of {score}%", align='C', ln=True)
        pdf.ln(20)
        pdf.set_font("Helvetica", "I", 12)
        pdf.cell(0, 10, f"Issued on {date}", align='C', ln=True)

        filename = os.path.join(self.output_dir, f"{participant_name}_{quiz_title}.pdf")
        pdf.output(filename)
        return filename

if __name__ == "__main__":
    service = CertificateService()
    result = service.generate_certificate("John Doe", "JavaScript Fundamentals", 92)
    print("Certificate generated:", result)
