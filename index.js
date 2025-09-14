    let rollMap = {};
    let lastResultType = 'info';

    // Update current time
    function updateTime() {
      const now = new Date();
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', options);
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Load roll numbers JSON
    fetch("rolls.json.json")
      .then(res => res.json())
      .then(data => {
        rollMap = data[0]; // because your JSON is wrapped in an array
        const count = Object.keys(rollMap).length;
        document.getElementById('rollCount').textContent = count.toLocaleString();
        
        // Update result display
        setResultContent(
          `✅ Database Loaded Successfully`,
          `${count.toLocaleString()} roll numbers ready for search`,
          'success'
        );
        console.log("✅ Loaded", count, "roll numbers");
      })
      .catch(err => {
        console.error("❌ Failed to load roll data:", err);
        setResultContent(
          "⚠️ Connection Error",
          'Failed to load roll numbers. Please check your connection.',
          'error'
        );
      });

    // Function to find section
    function findSection(roll) {
      if (!rollMap || Object.keys(rollMap).length === 0) {
        return {
          message: "🔄 System Initializing",
          details: 'Please wait while we load the roll numbers',
          type: "warning"
        };
      }

      // Direct match
      if (rollMap[roll]) {
        return {
          message: `🎉 Perfect Match! Roll ${roll}`,
          details: `Was in Section ${rollMap[roll]}`,
          type: "success"
        };
      }

      // Nearest match
      const rolls = Object.keys(rollMap).map(Number).filter(r => !isNaN(r));
      let nearest = rolls.reduce((prev, curr) =>
        Math.abs(curr - roll) < Math.abs(prev - roll) ? curr : prev
      );
      
      return {
        message: `Uhh, can't find it in my database , yet wont leave you sad XD`,
        details: `He/She was in :  Section ${rollMap[nearest]}`,
        type: "info"
      };
    }

    // Set result content with styling
    function setResultContent(message, details, type) {
      const resultDiv = document.getElementById('result');
      
      // Remove previous type class
      resultDiv.classList.remove(
        'result-success', 'result-error', 
        'result-warning', 'result-info'
      );
      
      // Add new type class
      resultDiv.classList.add(`result-${type}`);
      
      // Set icon based on type
      let icon = 'fa-info-circle';
      let iconColor = 'text-blue-500';
      if (type === 'success') {
        icon = 'fa-check-circle';
        iconColor = 'text-emerald-500';
      }
      if (type === 'error') {
        icon = 'fa-times-circle';
        iconColor = 'text-red-500';
      }
      if (type === 'warning') {
        icon = 'fa-exclamation-circle';
        iconColor = 'text-amber-500';
      }
      
      // Update content
      resultDiv.innerHTML = `
        <div class="flex items-start space-x-3">
          <i class="fas ${icon} ${iconColor} text-lg mt-0.5"></i>
          <div>
            <p class="font-medium">${message}</p>
            <p class="text-sm opacity-80 mt-1">${details}</p>
          </div>
        </div>
      `;
      
      // Add animation
      resultDiv.classList.remove('animate-fade-in');
      void resultDiv.offsetWidth; // Trigger reflow
      resultDiv.classList.add('animate-fade-in');
      
      lastResultType = type;
    }

    // Button click handler
    function checkRoll() {
      const rollInput = document.getElementById('rollInput');
      const roll = Number(rollInput.value);
      
      if (isNaN(roll) || rollInput.value.trim() === '') {
        setResultContent(
          "⚠️ Invalid Input",
          "Please enter a valid roll number",
          "warning"
        );
        // Add shake animation to input
        rollInput.classList.add('animate-shake');
        setTimeout(() => rollInput.classList.remove('animate-shake'), 500);
        return;
      }
      
      // Add pulse effect to input
      rollInput.classList.add('pulse');
      setTimeout(() => rollInput.classList.remove('pulse'), 1000);
      
      const result = findSection(roll);
      setResultContent(result.message, result.details, result.type);
    }
