import matplotlib.pyplot as plt
import numpy as np
import os

def generate_k_comparison():
    output_image = "reports/k_value_comparison.png"
    if not os.path.exists("reports"): os.makedirs("reports")
    
    k_values = [1, 3, 5, 7, 9]
    accuracies = [95.42, 89.15, 82.40, 78.10, 72.50]
    
    plt.figure(figsize=(10, 6))
    plt.style.use('seaborn-v0_8-whitegrid')
    
    plt.plot(k_values, accuracies, marker='o', linestyle='-', color='#1a3a5f', linewidth=2.5, markersize=8)
    
    # Highlight K=1
    plt.annotate(f'Selected K=1 ({accuracies[0]}%)', 
                 xy=(1, accuracies[0]), xytext=(2, 96),
                 arrowprops=dict(facecolor='black', shrink=0.05, width=1, headwidth=8),
                 fontsize=12, fontweight='bold', color='#cf3a24')
    
    plt.title('Analisis Akurasi terhadap Nilai K (KNN)', fontsize=14, fontweight='bold', pad=20)
    plt.xlabel('Nilai K (Neighbor)', fontsize=12)
    plt.ylabel('Akurasi Keseluruhan (%)', fontsize=12)
    plt.xticks(k_values)
    plt.ylim(60, 100)
    
    plt.tight_layout()
    plt.savefig(output_image, dpi=300)
    print(f"K-comparison saved to {output_image}")

def generate_subject_performance():
    output_image = "reports/subject_performance.png"
    
    # Mock/Calculated data based on Table 4.4
    subjects = [
        'Akbar', 'Hasim', 'Andi', 'Aditya', 'Fakhri', 
        'Andrea', 'Rafli', 'Rizky', 'Farrel', 'Dwicky', 
        'Rahmat', 'Gilbram'
    ]
    f1_scores = [1.00, 1.00, 1.00, 0.95, 1.00, 0.98, 1.00, 1.00, 0.92, 1.00, 1.00, 0.96]
    
    plt.figure(figsize=(12, 6))
    plt.style.use('seaborn-v0_8-whitegrid')
    
    y_pos = np.arange(len(subjects))
    bars = plt.barh(y_pos, f1_scores, align='center', color='#1a3a5f', alpha=0.8)
    
    plt.yticks(y_pos, subjects)
    plt.xlabel('F1-Score', fontsize=12)
    plt.title('Performa F1-Score per Subjek (Karyawan)', fontsize=14, fontweight='bold', pad=20)
    plt.xlim(0.8, 1.05)
    
    # Add values on bars
    for bar in bars:
        width = bar.get_width()
        plt.text(width + 0.01, bar.get_y() + bar.get_height()/2, f'{width:.2f}', 
                 va='center', fontsize=10, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(output_image, dpi=300)
    print(f"Subject performance saved to {output_image}")

if __name__ == "__main__":
    generate_k_comparison()
    generate_subject_performance()
